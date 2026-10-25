import axios, { AxiosResponse } from 'axios'
import {
  QuizInputData,
  AudioInputData,
  PredictionResponse,
  MLHistoryQuery,
  MLHistoryResponse,
  MLHistoryItem,
  MLRequestType
} from '../types/ml.type'
import { MLConfig } from '../config/ml.config'
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { db } from '../config/firebase.config'

export const mlService = {
  async sendQuizPrediction(uid: string, inputData: QuizInputData): Promise<PredictionResponse> {
    const response: AxiosResponse<PredictionResponse> = await axios.post(
      MLConfig.QUIZ_MODEL_API_URL,
      inputData
    )
    const userPredictionsRef = collection(db, `user_predictions/${uid}/quiz_requests`)
    await setDoc(doc(userPredictionsRef), {
      inputData,
      prediction: response.data,
      timestamp: new Date().toISOString()
    })

    return response.data
  },
  async sendAudioPrediction(uid: string, audioData: AudioInputData): Promise<PredictionResponse> {
    const formData = new FormData()
    formData.append(
      'audio',
      new Blob([audioData.buffer], { type: audioData.mimetype }),
      audioData.originalname
    )

    const response: AxiosResponse<PredictionResponse> = await axios.post(
      MLConfig.AUDIO_MODEL_API_URL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    const userPredictionsRef = collection(db, `user_predictions/${uid}/audio_requests`)
    await setDoc(doc(userPredictionsRef), {
      prediction: response.data,
      timestamp: new Date().toISOString()
    })

    return response.data
  },
  async sendHandwritingPrediction(
    uid: string,
    imageFile: Express.Multer.File
  ): Promise<PredictionResponse> {
    const formData = new FormData()
    formData.append(
      'file',
      new Blob([imageFile.buffer], { type: imageFile.mimetype }),
      imageFile.originalname
    )
    const response: AxiosResponse<PredictionResponse> = await axios.post(
      MLConfig.HANDWRITING_MODEL_API_URL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    const userPredictionsRef = collection(db, `user_predictions/${uid}/handwriting_requests`)
    await setDoc(doc(userPredictionsRef), {
      prediction: response.data,
      timestamp: new Date().toISOString(),
      filename: imageFile.originalname
    })

    return response.data
  },

  async getMLRequestHistory(uid: string, options: MLHistoryQuery): Promise<MLHistoryResponse> {
    const {
      type,
      page = 1,
      limit: pageLimit = 10,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = options

    const collectionPath = `user_predictions/${uid}/${type}`

    let mlHistoryQuery = query(collection(db, collectionPath), orderBy(sortBy, sortOrder))

    if (startDate && endDate) {
      mlHistoryQuery = query(
        mlHistoryQuery,
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)
      )
    }

    const countSnapshot = await getCountFromServer(mlHistoryQuery)
    const total = countSnapshot.data().count

    const historySnapshot = await getDocs(query(mlHistoryQuery, limit(pageLimit)))

    const history: MLHistoryItem[] = await Promise.all(
      historySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data()

        let predictionDetails = data.prediction

        if (data.predictionRef) {
          const predictionDocRef = doc(
            db,
            `user_predictions/${uid}/${type}_predictions`,
            data.predictionRef
          )
          const predictionDoc = await getDoc(predictionDocRef)

          if (predictionDoc.exists()) {
            predictionDetails = predictionDoc.data()
          }
        }

        return {
          id: docSnapshot.id,
          prediction: {
            result: predictionDetails?.data || predictionDetails
          },
          inputData: data.inputData || {},
          timestamp: data.timestamp,
          metadata: data.metadata || {}
        }
      })
    )

    return {
      history,
      total,
      page,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit)
    }
  },
  async getAllMLRequestHistory(
    uid: string,
    options: Omit<MLHistoryQuery, 'type'>
  ): Promise<MLHistoryResponse> {
    const {
      page = 1,
      limit: pageLimit = 10,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = options

    const requestTypes: MLRequestType[] = [
      MLRequestType.QUIZ,
      MLRequestType.AUDIO,
      MLRequestType.HANDWRITING
    ]

    const allHistoryPromises = requestTypes.map(async (type) => {
      const collectionPath = `user_predictions/${uid}/${type}`

      let mlHistoryQuery = query(collection(db, collectionPath), orderBy(sortBy, sortOrder))

      if (startDate && endDate) {
        mlHistoryQuery = query(
          mlHistoryQuery,
          where('timestamp', '>=', startDate),
          where('timestamp', '<=', endDate)
        )
      }

      const countSnapshot = await getCountFromServer(mlHistoryQuery)
      const total = countSnapshot.data().count

      const historySnapshot = await getDocs(query(mlHistoryQuery, limit(pageLimit)))

      const history: MLHistoryItem[] = await Promise.all(
        historySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data()

          let predictionDetails = data.prediction

          if (data.predictionRef) {
            const predictionDocRef = doc(
              db,
              `user_predictions/${uid}/${type}_predictions`,
              data.predictionRef
            )
            const predictionDoc = await getDoc(predictionDocRef)

            if (predictionDoc.exists()) {
              predictionDetails = predictionDoc.data()
            }
          }

          return {
            id: docSnapshot.id,
            type: type.replace('_requests', ''),
            prediction: {
              result: predictionDetails?.data || predictionDetails
            },
            inputData: data.inputData || {},
            timestamp: data.timestamp,
            metadata: data.metadata || {}
          }
        })
      )

      return { history, total }
    })

    const allHistoryResults = await Promise.all(allHistoryPromises)

    // Combine and sort all histories
    const combinedHistory = allHistoryResults
      .flatMap((result) => result.history)
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime()
        const dateB = new Date(b.timestamp).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      })

    const totalItems = allHistoryResults.reduce((sum, result) => sum + result.total, 0)

    return {
      history: combinedHistory.slice(0, pageLimit),
      total: totalItems,
      page,
      limit: pageLimit,
      totalPages: Math.ceil(totalItems / pageLimit)
    }
  }
}
