const messages = {
  'auth/invalid-credential': 'Грешен имейл или парола.',
  'auth/wrong-password': 'Грешен имейл или парола.',
  'auth/user-not-found': 'Грешен имейл или парола.',
  'auth/email-already-in-use': 'Вече има акаунт с този имейл.',
  'auth/invalid-email': 'Невалиден имейл адрес.',
  'auth/weak-password': 'Паролата е твърде слаба.',
  'auth/network-request-failed': 'Няма връзка с интернет. Опитай отново.',
  'auth/too-many-requests': 'Твърде много опити. Опитай по-късно.',
};

export function getAuthErrorMessage(error) {
  return messages[error.code] || 'Възникна грешка. Опитай отново.';
}
