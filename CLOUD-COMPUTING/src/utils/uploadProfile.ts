import multer from 'multer'

export const uploadProfileImage = multer({
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
    fileSize: 5 * 1024 * 1024
  }
}).single('profile_pic')
