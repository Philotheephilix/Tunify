import fs from 'fs';
import path from 'path';

const artistsFilePath = path.resolve('./data', 'artists.json');

const ensureFileExists = () => {
  if (!fs.existsSync(artistsFilePath)) {
    fs.writeFileSync(artistsFilePath, JSON.stringify([]));
  }
};

export default function handler(req, res) {
  ensureFileExists();

  const artistsData = JSON.parse(fs.readFileSync(artistsFilePath, 'utf8'));

  switch (req.method) {
    case 'POST':
      const { artistName, artistId, walletAddress } = req.body;
      if (!artistName || !artistId || !walletAddress) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const existingArtist = artistsData.find((artist) => artist.artistId === artistId);
      if (existingArtist) {
        return res.status(400).json({ error: 'Artist already exists' });
      }
      artistsData.push({ artistName, artistId, minuteslistened: '0', walletAddress });
      fs.writeFileSync(artistsFilePath, JSON.stringify(artistsData, null, 2));
      return res.status(200).json({ message: 'Artist added successfully' });

    case 'PUT':
      const { artistIdToUpdate, minutesToAdd } = req.body;
      if (!artistIdToUpdate || !minutesToAdd) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const artistIndex = artistsData.findIndex((artist) => artist.artistId === artistIdToUpdate);
      if (artistIndex === -1) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      const artist = artistsData[artistIndex];
      artist.minuteslistened = (parseInt(artist.minuteslistened) + parseInt(minutesToAdd)).toString();
      fs.writeFileSync(artistsFilePath, JSON.stringify(artistsData, null, 2));
      return res.status(200).json({ message: 'Artist minutes listened updated successfully' });

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
