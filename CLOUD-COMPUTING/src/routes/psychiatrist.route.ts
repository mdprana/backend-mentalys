import { Psychiatrist } from '../types/psychiatrist.type'
import { Router, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

const psychiatristRouter: Router = Router()

psychiatristRouter.get('/', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '../data/PsikiaterDummy.json')
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' })
    }
    const psychiatrists = JSON.parse(data)
    res.status(200).json({
      status: 'success',
      data: psychiatrists
    })
  })
})

psychiatristRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const filePath = path.join(__dirname, '../data/PsikiaterDummy.json')

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' })
    }

    const psychiatrists = JSON.parse(data)
    const psychiatrist = psychiatrists.find((psy: Psychiatrist) => psy.id === id)

    if (!psychiatrist) {
      return res.status(404).json({ message: 'Psychiatrist not found' })
    }

    res.status(200).json({
      status: 'success',
      data: psychiatrist
    })
  })
})

export default psychiatristRouter
