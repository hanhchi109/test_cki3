import express from 'express';
import mongoose from 'mongoose';
import films from './data.js'
import cors from 'cors'
import users from './users.js';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'; 
import multer from 'multer'



const app = express();
app.use(express.json());

const upload = multer({ dest: 'uploads/' })

dotenv.config();
const PORT = process.env.PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

app.use(cors({
    crossOrigin: "*"
}));

mongoose.connect("mongodb://localhost:27017/" + DATABASE_NAME);

app.listen(PORT, () => {
    console.log("Server running...");
});


//get all films

app.get('/api/v1/films', (req,res) => {
    try {
        res.status(200).json({
            films,
            message: 'List films',
            success: true
        })
    } catch (error) {
            res.status(500).json({
                data: null,
                message:'error fetching films list',
                success: false,
                error: error.message
            })
    }
})

//login

app.post('/login', (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: 'Vui lòng nhập email và username' });
    }
    const user = users.find((user) => (user.email === email || user.username === username));
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản hoặc email không đúng' });
    }
 
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  });


  //logout
app.post('/logout', (req,res) => {
    return res.status(200).json({message:'Đăng xuất thành công'})
}) 

// add new films

app.post('/films', (req, res) => {
    const newFilm = req.body;
    films.push(newFilm);
    res.status(201).json({
        message: 'Phim mới đã được thêm vào danh sách',
        success: true
    });
});

//update or edit films

app.put('/films/:id', (req, res) => {
    const filmId = req.params.id;
    const updatedFilm = req.body;
    const index = films.findIndex(film => film.ID === parseInt(filmId));
    if (index !== -1) {
        films[index] = { ...films[index], ...updatedFilm };
        res.status(200).json({
            message: 'Thông tin phim đã được cập nhật',
            success: true
        });
    } else {
        res.status(404).json({
            message: 'Không tìm thấy phim',
            success: false
        });
    }
});

// delete films

app.delete('/films/:id', (req, res) => {
    const filmId = req.params.id;
    const index = films.findIndex(film => film.ID === parseInt(filmId));
    if (index !== -1) {
        films.splice(index, 1);
        res.status(200).json({
            message: 'Phim đã được xóa khỏi danh sách',
            success: true
        });
    } else {
        res.status(404).json({
            message: 'Không tìm thấy phim',
            success: false
        });
    }
});

// search films

app.get('/films/search', (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const filteredFilms = films.filter(film => film.name.toLowerCase().includes(keyword.toLowerCase()));

    res.status(200).json({ films: filteredFilms });
});

// sort  films by year 
app.get('/films/sortByYear', (req, res) => {
    const sortedFilms = films.slice().sort((a, b) => a.year - b.year);

    res.status(200).json({ films: sortedFilms });
});


//upload image
app.post('/films/:filmId/upload-image', upload.single('image'), (req, res) => {
    try {
        const { filmId } = req.params;
        const film = films.find(film => film.id === filmId);

        if (!film) {
            return res.status(404).json({
                success: false,
                message: 'Film not found',
                data: null
            });
        }

        const imagePath = req.file.path;

        film.image = imagePath;

        return res.status(200).json({
            success: true,
            message: 'Ảnh đã được cập nhật thành công',
            data: film
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi trong quá trình cập nhật',
            error: error.message
        });
    }
});


