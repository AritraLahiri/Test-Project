const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 4000;
const path = require('path');
const User = require('./Model/Model');
dotenv.config();

// MIDDLEWARES
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// CONECTING TO THE DB
const connectUrl = process.env.DB_CONNECT;
mongoose
	.connect(connectUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('CONNECTION OPEN');
	})
	.catch((e) => console.log('SOMETHING BAD HAPPENED !' + e));
mongoose.set('useCreateIndex', true);

//SHOWING NEW FORM
app.get('/', (req, res) => {
	res.render('Home');
});

// POSTING DATA TO THE DATABASE
app.post('/submit/user', async (req, res) => {
	const { firstName, lastName, location } = req.body;
	const name = firstName + ' ' + lastName;

	try {
		const registerUser = new User({
			name,
			location
		});
		await registerUser.save();
		res.render('Home');
	} catch (error) {
		console.log(error);
		return res.json({ error });
	}

	res.json({ success: 'SUCCESS ' });
});

// SEARCH ROUTE
app.get('/search', async (req, res) => {
	const { name } = req.query;

	try {
		const fetchedUser = await User.find({ name });

		res.render('Result', { data: fetchedUser });
	} catch (error) {
		res.json({ error });
	}
});

// SHOWING ALL FILES FROM THE DATABASE
app.get('/show/user', async (req, res) => {
	const allUsers = await User.find();
	res.render('Gallery', { users: allUsers });
});

app.listen(port, (req, res) => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
});
