import express from 'express'
import cors from 'cors'

import routesTimes from './routes/times'
import routesServicos from './routes/servicos'
import routesFuncionarios from './routes/funcionarios'
import routesAdmins from './routes/admins'
import routesTickets from './routes/tickets'
import routesLogin from './routes/login'
import routesAdminLogin from './routes/adminLogin'
import routesDashboard from './routes/dashboard'

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.use("/times", routesTimes)
app.use("/servicos", routesServicos)
app.use("/funcionarios", routesFuncionarios)
app.use("/admins", routesAdmins)
app.use("/tickets", routesTickets)
app.use("/funcionarios/login", routesLogin)
app.use("/admins/login", routesAdminLogin)
app.use("/dashboard", routesDashboard)

app.get('/', (req, res) => {
  res.send('API: HelpDesk Avenue')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})