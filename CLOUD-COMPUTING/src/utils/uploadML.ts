import multer from 'multer'

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3']
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Batasi ukuran file 5MB
  }
})

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Please upload JPG, JPEG, or PNG file.'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})
