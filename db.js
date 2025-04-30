import { Sequelize } from "sequelize"
import * as dotenv from "dotenv"
dotenv.config()

const db = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASS
const host = process.env.DB_HOSTS
const dialect = process.env.DIALECT

if (!db || !username || !password) {
    throw new Error("missing required database variables")
}
export const sequelize = new Sequelize(db, username, password, {
    host,
    dialect
})

export const connectDb = async () => {
    try {
        await sequelize.authenticate()
        console.log('DB connected.');
        await sequelize.sync({});
        console.log('Models synchronized.');
    } catch (error) {
        throw error
    }
}
