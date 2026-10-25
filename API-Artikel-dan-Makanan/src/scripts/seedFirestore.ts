import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'
import { Article, ContentType, MentalState } from '../types/articleTypes'
import { IFood } from '../types/foodTypes'

const serviceAccountPath =
  process.env.FIREBASE_ADMIN_SDK_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(__dirname, '../../../skripsi-89586-firebase-adminsdk-fbsvc-f0d983a01b.json')

const toAndroidFriendlyIso = (date: Date): string => date.toISOString().replace(/\.\d{3}Z$/, 'Z')
const now = toAndroidFriendlyIso(new Date())
const medicalDisclaimer =
  'Educational content only. It does not replace diagnosis, treatment, or advice from a licensed health professional.'

const author = {
  id: 'mentalys-editorial',
  name: 'Mentalys Editorial Team',
  profile_image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
  bio: 'Mental health education content prepared from public health guidance and peer-reviewed literature.'
}

const reviewer = {
  name: 'Clinical reviewer needed',
  role: 'Replace with licensed psychologist, psychiatrist, physician, or dietitian before publication',
  organization: 'Mentalys',
  reviewed_at: now
}

const depressionReferences = [
  {
    title: 'Depression',
    source: 'National Institute of Mental Health',
    url: 'https://www.nimh.nih.gov/health/topics/depression',
    year: 2024
  },
  {
    title: 'Depressive disorder (depression)',
    source: 'World Health Organization',
    url: 'https://www.who.int/news-room/fact-sheets/detail/depression',
    year: 2025
  }
]

const dietReferences = [
  {
    title: 'Healthy diet',
    source: 'World Health Organization',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    year: 2026
  },
  {
    title:
      'A randomised controlled trial of dietary improvement for adults with major depression (the SMILES trial)',
    source: 'BMC Medicine',
    url: 'https://bmcmedicine.biomedcentral.com/articles/10.1186/s12916-017-0791-y',
    year: 2017,
    doi: '10.1186/s12916-017-0791-y'
  },
  {
    title:
      'The Effects of Dietary Improvement on Symptoms of Depression and Anxiety: A Meta-Analysis of Randomized Controlled Trials',
    source: 'Psychosomatic Medicine / PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30720698/',
    year: 2019,
    doi: '10.1097/PSY.0000000000000673'
  }
]

const articles: Article[] = [
  {
    id: 'depression-basics',
    title: 'Understanding Depression Screening Results',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['depression', 'mental-health', 'screening'],
      category: 'Mental Health Education',
      reading_time: 4,
      likes: 0,
      views: 0,
      mental_state: MentalState.DEPRESSION,
      image_link: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg',
      short_description:
        'What a depression screening result can and cannot tell you, based on public health guidance.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'A screening result is not a diagnosis. It is a signal that symptoms such as low mood, loss of interest, sleep changes, fatigue, poor concentration, appetite change, or feelings of worthlessness may need closer attention.'
      },
      {
        type: ContentType.PARAGRAPH,
        text: 'Depression can affect feelings, thoughts, sleep, appetite, work, study, and relationships. A licensed professional can assess symptoms, duration, severity, medical causes, and treatment options.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Use screening as an early warning, not as a label.',
          'Write down symptoms, duration, triggers, and daily impact.',
          'Contact a psychologist, psychiatrist, doctor, counselor, or clinic if symptoms persist or worsen.',
          'Seek urgent help if there are thoughts of self-harm or suicide.'
        ]
      }
    ]
  },
  {
    id: 'mild-depression-self-care',
    title: 'Mild Depression Risk: Practical First Steps',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['mild', 'self-care', 'routine'],
      category: 'Self Care',
      reading_time: 3,
      likes: 0,
      views: 0,
      mental_state: MentalState.MILD,
      image_link: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
      short_description:
        'Daily rhythm, social contact, and early support steps for mild-risk screening results.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Mild symptoms still deserve attention, especially if they last for weeks or begin to affect study, work, relationships, or self-care.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Keep a consistent sleep and wake schedule.',
          'Plan one small achievable activity each day.',
          'Avoid withdrawing completely from trusted people.',
          'Monitor whether symptoms improve, stay the same, or worsen.'
        ]
      }
    ]
  },
  {
    id: 'moderate-depression-support-plan',
    title: 'Moderate Depression Risk: When to Add Support',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['moderate', 'support', 'professional-help'],
      category: 'Support Planning',
      reading_time: 5,
      likes: 0,
      views: 0,
      mental_state: MentalState.MODERATE,
      image_link: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
      short_description:
        'A support plan for screening results that suggest symptoms are affecting daily function.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Moderate risk can mean symptoms are becoming harder to manage alone. Professional support is especially important when symptoms disrupt routines, responsibilities, relationships, or safety.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Share the result with a trusted person if it feels safe.',
          'Prepare notes about symptom duration, sleep, appetite, energy, and concentration.',
          'Use Mentalys history as a summary for a clinician.',
          'Book a consultation with a mental health professional or nearby clinic.'
        ]
      }
    ]
  },
  {
    id: 'severe-risk-getting-help',
    title: 'High Depression Risk: Safety and Urgent Help',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['severe', 'safety', 'help'],
      category: 'Safety',
      reading_time: 4,
      likes: 0,
      views: 0,
      mental_state: MentalState.SEVERE,
      image_link: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg',
      short_description:
        'Safety-focused steps for high-risk screening results and warning signs.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'A high-risk result should be treated seriously. If there are thoughts of self-harm, suicide, or immediate danger, contact emergency services or a crisis service immediately.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Do not stay alone if you feel unsafe.',
          'Tell a trusted person what is happening.',
          'Contact a psychiatrist, psychologist, doctor, emergency service, or crisis line.',
          'Remove or avoid access to things that could be used for self-harm.'
        ]
      }
    ]
  },
  {
    id: 'diet-and-depression-evidence',
    title: 'Food, Mood, and Depression: What the Evidence Says',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['nutrition', 'depression', 'wellness'],
      category: 'Nutrition',
      reading_time: 5,
      likes: 0,
      views: 0,
      mental_state: MentalState.DEPRESSION,
      image_link: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      short_description:
        'Diet is not a stand-alone depression treatment, but research supports healthy dietary patterns as part of care.',
      references: dietReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Nutrition should not replace therapy, medication, or clinical care when those are needed. However, healthy dietary patterns can support physical health and may help depressive symptoms as part of a broader treatment plan.'
      },
      {
        type: ContentType.PARAGRAPH,
        text: 'The SMILES randomized controlled trial studied dietary support for adults with major depression and found greater symptom improvement in the diet-support group than in the social-support control group. Later meta-analysis evidence also suggests dietary improvement can reduce depressive symptoms, while noting that study methods vary.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Prioritize vegetables, fruit, legumes, nuts, whole grains, and lean protein.',
          'Limit highly processed foods high in sugar, salt, saturated fat, or trans fat.',
          'Use food recommendations as wellness support, not as a depression cure.',
          'Ask a doctor or registered dietitian if you have medical conditions, pregnancy, eating disorder symptoms, allergies, or medication interactions.'
        ]
      }
    ]
  },
  {
    id: 'sleep-rhythm-and-mood',
    title: 'Sleep Rhythm and Mood: Why Routine Matters',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['sleep', 'routine', 'mood'],
      category: 'Self Care',
      reading_time: 4,
      likes: 0,
      views: 0,
      mental_state: MentalState.MILD,
      image_link: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg',
      short_description:
        'A practical guide to sleep rhythm as a support habit for mood, energy, and daily function.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Sleep changes are common when mood is low. Some people sleep much more than usual, while others wake often, sleep late, or feel tired even after resting.'
      },
      {
        type: ContentType.PARAGRAPH,
        text: 'A consistent sleep and wake schedule is not a cure for depression, but it can support emotional regulation, concentration, appetite, and energy while a person seeks appropriate help.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Choose a realistic wake time and keep it similar every day.',
          'Reduce screen brightness and heavy meals close to bedtime.',
          'Use a short wind-down routine such as breathing, reading, or quiet prayer.',
          'Speak with a clinician if insomnia, oversleeping, nightmares, or daytime fatigue continue.'
        ]
      }
    ]
  },
  {
    id: 'anxiety-vs-depression-overlap',
    title: 'When Anxiety and Depression Overlap',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['anxiety', 'depression', 'support'],
      category: 'Mental Health Education',
      reading_time: 5,
      likes: 0,
      views: 0,
      mental_state: MentalState.MODERATE,
      image_link: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg',
      short_description:
        'Anxiety and depressive symptoms can appear together. This article explains what to notice and when to seek help.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Anxiety and depression can overlap. A person may feel worried and tense while also feeling low, exhausted, hopeless, or less interested in daily activities.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Notice whether worry, sadness, irritability, sleep changes, or avoidance are affecting daily life.',
          'Track symptoms for a few days so a professional can see the pattern more clearly.',
          'Avoid self-diagnosing from one result only.',
          'Seek professional help if symptoms persist, worsen, or affect safety.'
        ]
      }
    ]
  },
  {
    id: 'talking-to-family-about-results',
    title: 'How to Talk to Family About Your Screening Result',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['family', 'communication', 'support'],
      category: 'Support Planning',
      reading_time: 4,
      likes: 0,
      views: 0,
      mental_state: MentalState.DEPRESSION,
      image_link: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
      short_description:
        'Simple steps for explaining a screening result to someone trusted without feeling judged.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'Talking about mental health can feel uncomfortable, especially if family members are not used to discussing emotions. A screening result can be used as a starting point rather than a final label.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Pick someone who is likely to listen calmly.',
          'Start with what you are experiencing, not only the score.',
          'Explain what kind of support you need, such as listening, help booking care, or company during a difficult day.',
          'If the conversation feels unsafe, contact a counselor, clinician, or trusted adult instead.'
        ]
      }
    ]
  },
  {
    id: 'when-to-see-a-psychiatrist',
    title: 'When Should You See a Psychiatrist?',
    author,
    metadata: {
      publish_date: now,
      last_updated: now,
      tags: ['psychiatrist', 'professional-help', 'treatment'],
      category: 'Professional Help',
      reading_time: 5,
      likes: 0,
      views: 0,
      mental_state: MentalState.HIGH_RISK,
      image_link: 'https://images.pexels.com/photos/4100420/pexels-photo-4100420.jpeg',
      short_description:
        'Signs that symptoms may need assessment from a psychiatrist or other licensed mental health professional.',
      references: depressionReferences,
      reviewed_by: reviewer,
      medical_disclaimer: medicalDisclaimer
    },
    content: [
      {
        type: ContentType.PARAGRAPH,
        text: 'A psychiatrist is a medical doctor who can assess mental health symptoms, consider medical contributors, and discuss treatment options including therapy referral and medication when appropriate.'
      },
      {
        type: ContentType.LIST,
        style: 'bullet',
        items: [
          'Consider professional care if symptoms last more than two weeks or interfere with school, work, relationships, or self-care.',
          'Seek urgent help for self-harm thoughts, suicidal thoughts, hallucinations, severe agitation, or inability to stay safe.',
          'Bring your screening history, symptom notes, medication list, and questions to the appointment.',
          'Medication decisions should always be made with a licensed clinician.'
        ]
      }
    ]
  }
]

const foods: IFood[] = [
  {
    id: 'oatmeal-banana',
    name: 'Oatmeal with Banana',
    description:
      'A simple breakfast built around oats and fruit. Whole grains and fruit fit WHO healthy-diet guidance and can support a steadier daily routine.',
    category: 'Breakfast',
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
    evidenceNote:
      'Based on healthy dietary pattern guidance: whole grains and fruit are recommended as part of a balanced diet.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'salmon-brown-rice',
    name: 'Salmon and Brown Rice',
    description:
      'A balanced meal idea with protein, unsaturated fats, and whole-grain carbohydrate. Use local fish alternatives when salmon is not accessible.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/3296547/pexels-photo-3296547.jpeg',
    evidenceNote:
      'Based on healthy dietary pattern guidance and nutrition psychiatry trials studying dietary improvement as adjunct support.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'yogurt-berries',
    name: 'Yogurt with Berries',
    description:
      'A snack option with dairy protein and fruit. Choose unsweetened yogurt when possible to reduce free sugar intake.',
    category: 'Snack',
    imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg',
    evidenceNote:
      'Based on healthy dietary guidance to include fruit and limit free sugars.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'spinach-egg-bowl',
    name: 'Spinach Egg Bowl',
    description:
      'A practical meal idea with eggs and leafy vegetables. It supports dietary diversity and can be adapted to local vegetables.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    evidenceNote:
      'Based on healthy dietary guidance to include vegetables and protein sources as part of varied meals.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'tempe-vegetable-rice-bowl',
    name: 'Tempe Vegetable Rice Bowl',
    description:
      'A familiar Indonesian meal with tempe, vegetables, and rice. It gives plant protein, fiber, and steady carbohydrates for daily energy.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    evidenceNote:
      'Uses the healthy dietary pattern principle of combining vegetables, legumes or soy protein, and staple carbohydrates.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'gado-gado-light-sauce',
    name: 'Gado-Gado with Light Peanut Sauce',
    description:
      'A vegetable-based Indonesian dish with tofu, egg, and peanut sauce. Keep the sauce moderate to balance flavor and calories.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg',
    evidenceNote:
      'Supports vegetable variety and protein intake while encouraging moderation with calorie-dense sauces.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'chicken-soup-vegetables',
    name: 'Chicken Vegetable Soup',
    description:
      'A warm meal option with lean protein and vegetables. It can be gentle when appetite is low and easy to prepare in batches.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    evidenceNote:
      'Balanced meals with protein and vegetables can help maintain energy and routine during low mood.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'fruit-nut-snack',
    name: 'Fruit and Nuts Snack',
    description:
      'A simple snack pairing fruit with a small handful of nuts. It offers fiber, micronutrients, and unsaturated fats.',
    category: 'Snack',
    imageUrl: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
    evidenceNote:
      'Based on healthy diet guidance to include fruit and nuts while limiting highly processed snacks.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'tuna-sweet-potato-salad',
    name: 'Tuna and Sweet Potato Salad',
    description:
      'A meal with fish protein, complex carbohydrate, and vegetables. Use local fish options and adjust seasoning to preference.',
    category: 'Main Meal',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    evidenceNote:
      'Fits a balanced plate pattern with protein, vegetables, and minimally processed carbohydrate.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'mung-bean-porridge',
    name: 'Mung Bean Porridge',
    description:
      'A legume-based comfort food. Choose moderate sweetness and add ginger or coconut milk carefully depending on preference and health needs.',
    category: 'Snack',
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    evidenceNote:
      'Legumes support dietary fiber and protein intake. Keep added sugar moderate.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'avocado-wholegrain-toast',
    name: 'Avocado Whole-Grain Toast',
    description:
      'A quick meal with whole-grain bread and avocado. Add egg or tofu for more protein if needed.',
    category: 'Breakfast',
    imageUrl: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg',
    evidenceNote:
      'Combines whole grains and unsaturated fats as part of a balanced dietary pattern.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  },
  {
    id: 'vegetable-omelet',
    name: 'Vegetable Omelet',
    description:
      'A simple egg-based meal with vegetables. It can be prepared quickly when energy or motivation is low.',
    category: 'Breakfast',
    imageUrl: 'https://images.pexels.com/photos/6294354/pexels-photo-6294354.jpeg',
    evidenceNote:
      'Supports protein intake and vegetable variety in a low-effort meal.',
    references: dietReferences,
    reviewedBy: {
      name: 'Clinical nutrition reviewer needed',
      role: 'Replace with registered dietitian, nutritionist, or physician before publication',
      organization: 'Mentalys',
      reviewedAt: now
    }
  }
]

const initializeFirebase = (): FirebaseFirestore.Firestore => {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file was not found. Set FIREBASE_ADMIN_SDK_PATH or GOOGLE_APPLICATION_CREDENTIALS. Tried: ${serviceAccountPath}`
    )
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  return admin.firestore()
}

const seed = async (): Promise<void> => {
  const db = initializeFirebase()
  const batch = db.batch()

  for (const article of articles) {
    batch.set(db.collection('articles').doc(article.id), article, { merge: true })
  }

  for (const food of foods) {
    if (!food.id) continue
    batch.set(db.collection('foods').doc(food.id), food, { merge: true })
  }

  await batch.commit()

  console.log(`Seeded ${articles.length} articles and ${foods.length} foods.`)
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await admin.app().delete().catch(() => undefined)
  })
