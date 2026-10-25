import { getFirestoreInstance } from '../config/firebase'
import { Article, GetArticle, GetArticlesResponse, MentalState } from '../types/articleTypes'

// Simpan artikel ke Firestore
export const saveArticle = async (article: Article): Promise<string> => {
  const db = await getFirestoreInstance() // Pastikan mendapatkan instance Firestore

  if (!article.id) {
    article.id = db.collection('articles').doc().id
  }

  if (!article.metadata.publish_date) {
    article.metadata.publish_date = new Date().toISOString()
  }
  article.metadata.last_updated = new Date().toISOString()
  article.metadata.views = article.metadata.views || 0
  article.metadata.likes = article.metadata.likes || 0

  await db.collection('articles').doc(article.id).set(article) // Simpan artikel ke Firestore
  return article.id
}

// Ambil semua artikel dari Firestore
export const getArticles = async (): Promise<GetArticlesResponse> => {
  const db = await getFirestoreInstance() // Pastikan mendapatkan instance Firestore
  const querySnapshot = await db.collection('articles').get()
  const articles: GetArticle[] = []

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Article
    articles.push({
      id: data.id,
      title: data.title,
      metadata: data.metadata
    })
  })

  const count = articles.length

  return {
    count,
    articles
  }
}

// Ambil artikel berdasarkan ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  const db = await getFirestoreInstance() // Pastikan mendapatkan instance Firestore
  const doc = await db.collection('articles').doc(id).get()
  return doc.exists ? (doc.data() as Article) : null
}

// Hapus artikel berdasarkan ID
export const deleteArticle = async (id: string): Promise<void> => {
  const db = await getFirestoreInstance() // Pastikan mendapatkan instance Firestore
  await db.collection('articles').doc(id).delete()
}

export const getArticlesByMentalState = async (
  mentalState: MentalState
): Promise<GetArticlesResponse> => {
  const db = await getFirestoreInstance() // Pastikan mendapatkan instance Firestore
  const querySnapshot = await db
    .collection('articles')
    .where('metadata.mental_state', '==', mentalState)
    .get()
  const articles: GetArticle[] = []

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Article
    articles.push({
      id: data.id,
      title: data.title,
      metadata: data.metadata
    })
  })

  const count = articles.length

  return {
    count,
    articles
  }
}
