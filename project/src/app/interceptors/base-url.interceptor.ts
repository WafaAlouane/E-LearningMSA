import { HttpInterceptorFn } from '@angular/common/http';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Set this to your Spring Boot API base URL
  const apiUrl = 'http://localhost:9090';
  
  // Only modify requests going to relative URLs
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({
      url: `${apiUrl}${req.url}`
    });
    return next(apiReq);
  }
  
  return next(req);
};