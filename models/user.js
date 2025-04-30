import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otp_created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role:{
        type:DataTypes.ENUM,
        values:["USER","ADMIN"],
        defaultValue:"USER"
    },
    country_code: {
        type: DataTypes.STRING
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: "user_accounts",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
