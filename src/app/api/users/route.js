import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const artistListenFilePath = path.join(process.cwd(), 'data', 'artistlisten.json');

// Ensure the data directory and files exist
const ensureFileExists = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  if (!fs.existsSync(artistListenFilePath)) {
    fs.writeFileSync(artistListenFilePath, JSON.stringify({}));
  }
};

// Helper to read users data
const readUsersData = () => {
  ensureFileExists();
  return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
};

// Helper to write users data
const writeUsersData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
};

// Helper to read artist listening data
const readArtistListenData = () => {
  ensureFileExists();
  return JSON.parse(fs.readFileSync(artistListenFilePath, 'utf8'));
};

// Helper to write artist listening data
const writeArtistListenData = (data) => {
  fs.writeFileSync(artistListenFilePath, JSON.stringify(data, null, 2));
};

// PUT /api/users
export async function PUT(request) {
  try {
    const body = await request.json();
    const { userID, addBalance, addMinutes, artistID } = body;

    if (!userID) {
      return NextResponse.json(
        { error: 'Missing userID' },
        { status: 400 }
      );
    }

    const users = readUsersData();
    const artistListenData = readArtistListenData();

    const userIndex = users.findIndex((user) => String(user.userID) === String(userID));

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update balance if provided
    if (addBalance) {
      const currentBalance = parseFloat(users[userIndex].balance);
      const addedBalance = parseFloat(addBalance);
      if (isNaN(addedBalance)) {
        return NextResponse.json(
          { error: 'Invalid balance amount' },
          { status: 400 }
        );
      }
      users[userIndex].balance = (currentBalance + addedBalance).toString();
    }

    // Update minutes if provided
    if (addMinutes) {
      const currentMinutes = parseFloat(users[userIndex].minuteslistened);
      const addedMinutes = parseFloat(addMinutes);
      if (isNaN(addedMinutes)) {
        return NextResponse.json(
          { error: 'Invalid minutes amount' },
          { status: 400 }
        );
      }
      users[userIndex].minuteslistened = (currentMinutes + addedMinutes).toString();

      // Increment artist's listening time
      if (artistID) {
        const currentArtistTime = artistListenData[artistID] || 0;
        artistListenData[artistID] = currentArtistTime + addedMinutes;
        writeArtistListenData(artistListenData);
      }
    }

    writeUsersData(users);
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID');

    const users = readUsersData();

    if (userID) {
      const user = users.find((u) => u.userID === userID);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// POST /api/users
export async function POST(request) {
  try {
    const body = await request.json();
    const { userID, walletAddress, balance = '0', minuteslistened = '0' } = body;

    if (!userID || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const users = readUsersData();
    
    // Check if user already exists
    const existingUser = users.find(
      user => user.userID === userID || user.walletAddress === walletAddress
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 200 }
      );
    }

    // Create new user
    const newUser = {
      userID,
      walletAddress,
      balance,
      minuteslistened
    };

    users.push(newUser);
    writeUsersData(users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}