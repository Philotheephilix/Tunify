import fs from 'fs';
import path from 'path';

const usersFilePath = path.resolve('./data', 'users.json');
const ensureFileExists = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
};

export default function handler(req, res) {
  ensureFileExists();
  const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));

  switch (req.method) {
    case 'POST':
      const { userID, walletAddress, balance } = req.body;
      if (!userID || !walletAddress) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const existingUser = usersData.find((user) => user.userID === userID);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      usersData.push({ userID, walletAddress, minuteslistened: '0', balance: balance || '0' });
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
      return res.status(200).json({ message: 'User added successfully' });

    case 'PUT':
      const { userIDToUpdate, minutesToAdd } = req.body;
      if (!userIDToUpdate || !minutesToAdd) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const userIndex = usersData.findIndex((user) => user.userID === userIDToUpdate);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = usersData[userIndex];
      user.minuteslistened = (parseInt(user.minuteslistened) + parseInt(minutesToAdd)).toString();
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
      return res.status(200).json({ message: 'User minutes listened updated successfully' });

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
