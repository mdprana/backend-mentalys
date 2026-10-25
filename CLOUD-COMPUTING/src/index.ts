import web from './middleware/web'

const port: number = Number(process.env.PORT || 3000)
web.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
