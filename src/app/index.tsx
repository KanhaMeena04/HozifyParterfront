import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import CustomSplashScreen from '@/components/CustomSplashScreen';
import { useDocStore } from '@/store/docStore';
import { useFlowStore } from '@/store/flowStore';
import { useServicesStore } from '@/store/servicesStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { useServiceAreaStore } from '@/store/serviceAreaStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { UserSession } from '@/types/storage.types';

export default function IndexScreen() {
  useAndroidBack();
  const { initialize: initAuth } = useAuthStore();
  const { initialize: initDocs } = useDocStore();
  const { initialize: initFlow } = useFlowStore();
  const { initialize: initEmployees } = useEmployeeStore();
  const { loadServices } = useServicesStore();
  const { loadAreas } = useServiceAreaStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const init = async () => {
      // Still init existing stores for backwards compatibility if they are used elsewhere
      await Promise.all([
        initAuth(),
        initDocs(),
        initFlow(),
        initEmployees(),
        loadServices(),
        loadAreas(),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);
      
      const userSession = await StorageService.getUserSession();
      const flowState = await StorageService.getMandatoryFlow();
      
      let isAllStepsCompleted = false;
      if (userSession && userSession.isLoggedIn && userSession.role) {
        const { ROLE_STEPS } = require('@/utils/onboarding');
        const roleSteps = ROLE_STEPS[userSession.role as keyof typeof ROLE_STEPS] || [];
        isAllStepsCompleted = roleSteps.length > 0 && roleSteps.every((step: string) => {
          const status = flowState[step as keyof typeof flowState];
          return status === 'completed' || status === 'verified' || status === 'reviewing';
        });
      }

      if (userSession && userSession.isLoggedIn && isAllStepsCompleted) {
        userSession.isApproved = true;
        await StorageService.setUserSession(userSession);
      }
      
      setSession(userSession || { phone: '', role: null, isLoggedIn: false, isApproved: false });
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized || !session) {
    return <CustomSplashScreen />;
  }

  if (session.isLoggedIn) {
    if (!session.role) {
      return <Redirect href="/(auth)/role-selection" />;
    }
    if (session.isApproved) {
      return <Redirect href="/(dashboard)" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  return <Redirect href="/(auth)/login" />;
}
