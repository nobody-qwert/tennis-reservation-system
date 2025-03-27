import useAuthStore from '../stores/useAuthStore';

export const useHomeLogic = () => {
  const { user } = useAuthStore();

  return {
    user
  };
};
