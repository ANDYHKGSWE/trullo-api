import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

mongoose
	.connect('mongodb://localhost:27017/trullo', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error('Connection error', error);
	});
