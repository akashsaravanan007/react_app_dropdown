import express from "express";
import mongoose from "mongoose";
import cors from 'cors';   
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://akash:akash123@mern-apps.dgtsqdb.mongodb.net/User_check?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isChecked: Boolean,
  dropdownValue: String,
});

const UserModel = mongoose.model('User', userSchema);


app.post('/api/users', async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await UserModel.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
