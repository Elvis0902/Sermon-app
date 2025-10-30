import React, { useEffect, useState } from "react";
import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const GoogleDriveAudioList = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  // ✅ Your actual folder ID
  const FOLDER_ID = "18sIAPRAfl_M2keafETqdgv5eNLstg-nv";
  // 🔑 Replace this with your actual Google API key
  const API_KEY = "AIzaSyCRJPm2-XAbkt8y3P-2SanAxzTWxGwjt0M";

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'audio/'&key=${API_KEY}&fields=files(id,name,mimeType)`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.files) {
          setTracks(data.files);
        } else {
          console.error("No audio files found:", data);
        }
      } catch (err) {
        console.error("Error fetching audios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, []);

  if (loading) return <p className="text-gray-400">Loading audios...</p>;

  const handlePlayTrack = (file) => {
    const track = {
      id: file.id,
      title: file.name,
      artist: 'Drive Audio',
      url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${API_KEY}`,
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'
    };
    playTrack(track);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎵 Google Drive Audios</h2>
      {tracks.length === 0 ? (
        <p className="text-gray-400">No audio files found in this folder.</p>
      ) : (
        <div className="space-y-3">
          {tracks.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Play size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{file.name}</h3>
                  <p className="text-sm text-gray-400">{file.mimeType}</p>
                </div>
              </div>
              <button
                onClick={() => handlePlayTrack(file)}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                <Play size={20} fill="white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleDriveAudioList;
