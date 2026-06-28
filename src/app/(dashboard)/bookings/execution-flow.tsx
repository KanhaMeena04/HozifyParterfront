import { Redirect } from 'expo-router';
import React from 'react';

export default function RedirectScreen() {
  return <Redirect href="/(dashboard)/bookings" />;
}
