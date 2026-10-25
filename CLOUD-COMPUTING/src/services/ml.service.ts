import axios, { AxiosResponse } from 'axios'
import admin from 'firebase-admin'
import {
  QuizInputData,
  AudioInputData,
  MLHistoryMetadataInput,
  PredictionResponse,
  MLHistoryQuery,
  MLHistoryResponse,
  MLHistoryItem,
  MLRequestType
} from '../types/ml.type'
import { getModelApiUrl, MLConfig } from '../config/ml.config'

const firestore = () => admin.firestore()

function removeUndefinedValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedValues(item)) as T
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefinedValues(entryValue)])
    ) as T
  }

  return value
}

export const mlService = {
  async sendQuizPrediction(uid: string, inputData: QuizInputData): Promise<PredictionResponse> {
    const response: AxiosResponse<PredictionResponse> = await axios.post(
      getModelApiUrl(MLConfig.QUIZ_MODEL_API_URL, 'Quiz'),
      inputData
    )
    await firestore().collection(`user_predictions/${uid}/quiz_requests`).doc().set({
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
      getModelApiUrl(MLConfig.AUDIO_MODEL_API_URL, 'Audio'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    await firestore().collection(`user_predictions/${uid}/audio_requests`).doc().set({
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
      getModelApiUrl(MLConfig.HANDWRITING_MODEL_API_URL, 'Handwriting'),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    await firestore().collection(`user_predictions/${uid}/handwriting_requests`).doc().set({
      prediction: response.data,
      timestamp: new Date().toISOString(),
      filename: imageFile.originalname
    })

    return response.data
  },

  async saveHistoryMetadata(
    uid: string,
    inputData: MLHistoryMetadataInput
  ): Promise<MLHistoryItem> {
    const { type, timestamp, prediction, confidence, ...metadata } = inputData
    const documentRef = firestore().collection(`user_predictions/${uid}/${type}`).doc()
    const createdAt = timestamp || new Date().toISOString()
    const historyData = removeUndefinedValues({
      prediction: {
        prediction,
        confidence
      },
      timestamp: createdAt,
      metadata
    })

    await documentRef.set(historyData)

    return {
      id: documentRef.id,
      type: type.replace('_requests', ''),
      prediction: {
        result: {
          prediction,
          confidence
        }
      },
      inputData: {},
      timestamp: createdAt,
      metadata
    }
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

    let mlHistoryQuery: FirebaseFirestore.Query = firestore()
      .collection(`user_predictions/${uid}/${type}`)
      .orderBy(sortBy, sortOrder)

    if (startDate && endDate) {
      mlHistoryQuery = mlHistoryQuery
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<=', endDate)
    }

    const countSnapshot = await mlHistoryQuery.get()
    const total = countSnapshot.size

    const historySnapshot = await mlHistoryQuery.limit(pageLimit).get()

    const history: MLHistoryItem[] = await Promise.all(
      historySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data()

        let predictionDetails = data.prediction

        if (data.predictionRef) {
          const predictionDoc = await firestore()
            .collection(`user_predictions/${uid}/${type}_predictions`)
            .doc(data.predictionRef)
            .get()

          if (predictionDoc.exists) {
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
      MLRequestType.FACE,
      MLRequestType.MULTIMODAL
    ]

    const allHistoryPromises = requestTypes.map(async (type) => {
      let mlHistoryQuery: FirebaseFirestore.Query = firestore()
        .collection(`user_predictions/${uid}/${type}`)
        .orderBy(sortBy, sortOrder)

      if (startDate && endDate) {
        mlHistoryQuery = mlHistoryQuery
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate)
      }

      const countSnapshot = await mlHistoryQuery.get()
      const total = countSnapshot.size

      const historySnapshot = await mlHistoryQuery.limit(pageLimit).get()

      const history: MLHistoryItem[] = await Promise.all(
        historySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data()

          let predictionDetails = data.prediction

          if (data.predictionRef) {
            const predictionDoc = await firestore()
              .collection(`user_predictions/${uid}/${type}_predictions`)
              .doc(data.predictionRef)
              .get()

            if (predictionDoc.exists) {
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
  },

  async deleteAllMLRequestHistory(uid: string): Promise<{ deletedCount: number }> {
    const requestTypes: MLRequestType[] = [
      MLRequestType.QUIZ,
      MLRequestType.AUDIO,
      MLRequestType.FACE,
      MLRequestType.MULTIMODAL
    ]

    const deleteResults = await Promise.all(
      requestTypes.map(async (type) => {
        const historySnapshot = await firestore()
          .collection(`user_predictions/${uid}/${type}`)
          .get()
        await Promise.all(historySnapshot.docs.map((docSnapshot) => docSnapshot.ref.delete()))
        return historySnapshot.size
      })
    )

    return {
      deletedCount: deleteResults.reduce((total, count) => total + count, 0)
    }
  }
}
