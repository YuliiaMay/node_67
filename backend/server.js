const express = require("express");
const app = express();
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const usersModel = require("./models/usersModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require("./midlewares/authMiddleware");
const rolesModel = require("./models/rolesModel")

const notFoundRoute = require("./midlewares/notFoundRoute");
const connectDB = require("../config/connectDB");
const path = require("path");
const configPath = path.join(__dirname, "..", "config", ".env");
dotenv.config({ path: configPath });
require("colors");

// Set forms
app.use(express.urlencoded({ extended: false }));

// Set JSON
app.use(express.json());




// реєстрація - створення юзера в БД

// аутентифікація - перевірка данних, які нам надав користувач та порівняння із данними, що у нас є у БД

// ауторизація - перевірка прав доступа

// логаут - вихід із системи

app.post('/register', asyncHandler(async (req, res) => {
    // отримаємо та валідуємо дані
    // шукаємо користувача у БД
    // якщо знаходимо користувача, повідомляємо про помилку реєстацію
    // якщо не знайшли, хешуємо пароль
    // зберігаємо в БД

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Provide all required fields");
    }
    
    const candidat = await usersModel.findOne({ email });

    if (candidat) {
        res.status(400);
        throw new Error("User already exists. Pleas login");
    };

    const hashPassward = bcrypt.hashSync(password, 5);

    const roles = await rolesModel.findOne({ value: "ADMIN" });
    
    const user = await usersModel.create({
        ...req.body,
        password: hashPassward,
        roles: [roles.value]
    });



    res.status(201).json({
        code: 201,
        message: "Success",
        data: {
            name: user.name,
            email: user.email,
        }
    });

}));

app.post('/login', asyncHandler(async (req, res) => {
    // отримаємо та валідуємо дані
    // шукаємо користувача у БД і розшифровуємо пароль
    // якщо не знайшли користувача або не розшифрували пароль - помилка: не вірний логін або пароль
    // якщо не знайшли і розшифрували пароль - видаємо токін
    // зберігаємо токін в базу
    

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Provide all required fields");
    }
    
    const user = await usersModel.findOne({ email });
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!user || !isValidPassword) {
        res.status(400);
        throw new Error("Invalid login or password!");
    };

    const token = generateToken({
        friends: ["Yuliia", "Tetyana", "Ihor", "Vitaly"],
        id: user._id,
        roles: user.roles
    });

    user.token = token;

    await user.save();

    res.status(200).json({
        code: 200,
        message: "Success",
        data: {
            token: user.token,
            email: user.email,
        }
    });

}));

app.get('/logout', authMiddleware, asyncHandler(async (req, res) => {
    // отримуємо id користувача
    // шукаємо користувача по id
    // token: null

    const id = req.user;

    const user = await usersModel.findById(id);

    user.token = null;

    await user.save();
    res.status(200).json({
        code: 200,
        message: "Success logout",
        data: {
            email: user.email,
        }
    });

}));


app.use("/api/v1", require("./routes/filmsRoutes"));

app.use("*", notFoundRoute);

app.use((err, req, res, next) => {
    console.log(res.statusCode);
    const statusCode = res.statusCode || 500;

    res.status(statusCode);
    res.json({ code: statusCode, stack: err.stack });
});

connectDB();
// console.log(process.env.PORT);
// console.log(process.env.USER);
// console.log(process.env.DB_URI);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green.italic.bold);
});


function generateToken(data) {
    const payload = { ...data };
    return jwt.sign(payload, "pizza", { expiresIn: "8h" });
}