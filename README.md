# 👤 Student Attendance System (Face Recognition)

A modern, full-stack attendance management system powered by facial recognition. Upload group photos to automatically identify and mark attendance for registered students.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- 🚀 **Automated Attendance**: Upload a photo to mark attendance instantly.
- 👥 **Multi-Face Detection**: Processes multiple students in a single image.
- 🔍 **Unknown Detection**: Automatically flags unregistered faces.
- 📊 **History Tracking**: View past sessions and student records.
- 📥 **Export to CSV**: Download attendance reports for any session.

---

## 🛠️ Tech Stack

- **Backend**: Python, Flask, OpenCV, `face_recognition`, MongoDB
- **Frontend**: React (Vite), Tailwind CSS, Lucide React
- **Database**: MongoDB (Local or Atlas)

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Configure your MONGO_URI
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Usage

1. **Register**: Go to the "Register Student" page, enter details, and upload a clear face photo.
2. **Attendance**: Upload a group photo in the "Take Attendance" section.
3. **Download**: Navigate to "History" to view and export reports as CSV.

---

## 📄 License & Author

- **Author**: Abhishek Shukla ([@abhishek-devhub](https://github.com/abhishek-devhub))
- **License**: MIT

---

**Built with ❤️ for educational efficiency.**
