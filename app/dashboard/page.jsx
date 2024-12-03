"use client";
import React from "react";
import ProtectRoute from "../ProtectRoute";

import { useEffect, useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distance, setDistance] = useState(null);
  const [checkInDisabled, setCheckInDisabled] = useState(true);
  const [checkOutDisabled, setCheckOutDisabled] = useState(true);
  const officeLocation = { lat: 41.2995, lng: 69.2401 }; // Ishxona joylashuvi koordinatalari (misol uchun)

  const getDistance = (userLat, userLng) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371e3; // Yer radiusi (metr)
    const lat1 = toRad(officeLocation.lat);
    const lat2 = toRad(userLat);
    const deltaLat = toRad(userLat - officeLocation.lat);
    const deltaLng = toRad(userLng - officeLocation.lng);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const distanceToOffice = getDistance(userLat, userLng);

        setDistance(distanceToOffice);
        if (distanceToOffice <= 20) {
          setCheckInDisabled(false);
          setCheckOutDisabled(false);
        } else {
          setCheckInDisabled(true);
          setCheckOutDisabled(true);
        }
      },
      (error) => {
        console.error("Joylashuvni aniqlashda xatolik:", error);
        setLocationEnabled(false);
      }
    );
  };

  const handleCheckIn = async () => {
    const now = new Date();
    try {
      await setDoc(
        doc(db, "attendance", user.uid),
        {
          checkIn: now.toISOString(),
        },
        { merge: true }
      );
      alert("Ishga kelganingiz qayd etildi!");
      setCheckInDisabled(true);
    } catch (error) {
      console.error("Maʼlumotni yozishda xatolik:", error);
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    try {
      await setDoc(
        doc(db, "attendance", user.uid),
        {
          checkOut: now.toISOString(),
        },
        { merge: true }
      );
      alert("Ishdan ketganingiz qayd etildi!");
      setCheckOutDisabled(true);
    } catch (error) {
      console.error("Maʼlumotni yozishda xatolik:", error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationEnabled(true);
      checkLocation();
    } else {
      setLocationEnabled(false);
    }
  }, []);

  return (
    <ProtectRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Xush kelibsiz, {user?.email}</p>
        {locationEnabled ? (
          <>
            <p>Joylashuv aniqlanmoqda...</p>
            <p>
              Hozirgi masofa ishxonadan:{" "}
              {distance ? `${distance.toFixed(2)} m` : "---"}
            </p>
            <button onClick={handleCheckIn} disabled={checkInDisabled}>
              Ishga keldim
            </button>
            <button onClick={handleCheckOut} disabled={checkOutDisabled}>
              Ishdan ketdim
            </button>
          </>
        ) : (
          <p>Joylashuv xizmatlari yoqilmagan.</p>
        )}
      </div>
    </ProtectRoute>
  );
};

export default Dashboard;
