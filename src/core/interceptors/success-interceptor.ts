
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
export const successInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const status = event.status;
        const method = req.method;

        // only success responses
        if (status >= 200 && status < 300) {
          switch (method) {
            case 'GET':
              console.log('📥 Data fetched successfully');
              break;

            case 'POST':
              console.log('➕ Created successfully');
              break;

            case 'PUT':
            case 'PATCH':
              console.log('✏️ Edited / Updated successfully');
              break;

            case 'DELETE':
              console.log('🗑️ Deleted successfully');
              break;

            default:
              console.log('✅ Request successful');
              break;
          }
        }
      }
    }),
  );
};
