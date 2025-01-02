export const hasTemplateAccess = (template, user) => {
  if (!template || !user) return false;
  
  // Admin has access when viewing template details, but not in their dashboard
  if (user.role === 'admin' && window.location.pathname.includes('/template/')) {
    return true;
  }
  
  return template.user.toString() === user._id.toString();
}; 