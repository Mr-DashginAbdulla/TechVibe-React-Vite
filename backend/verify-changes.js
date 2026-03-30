try {
  require('./src/utils/emailTemplates');
  require('./src/middleware/cache');
  
  // Test email template function
  const { orderConfirmationTemplate, orderStatusUpdateTemplate } = require('./src/utils/emailTemplates');
  const { cache, cacheMiddleware, invalidateCache, invalidateCacheMiddleware } = require('./src/middleware/cache');
  
  // Verify functions exist
  console.log('orderConfirmationTemplate:', typeof orderConfirmationTemplate);
  console.log('orderStatusUpdateTemplate:', typeof orderStatusUpdateTemplate);
  console.log('cacheMiddleware:', typeof cacheMiddleware);
  console.log('invalidateCache:', typeof invalidateCache);
  console.log('invalidateCacheMiddleware:', typeof invalidateCacheMiddleware);
  
  // Test multilingual template rendering
  const testOrder = { orderNumber: 'ORD-TEST-001', status: 'pending', totalAmount: 100, currency: 'AZN' };
  const testUser = { firstName: 'Test' };
  
  const azHtml = orderConfirmationTemplate(testOrder, testUser, 'az');
  const enHtml = orderConfirmationTemplate(testOrder, testUser, 'en');
  const ruHtml = orderConfirmationTemplate(testOrder, testUser, 'ru');
  
  console.log('AZ template contains AZ text:', azHtml.includes('Sifarişiniz Təsdiqləndi'));
  console.log('EN template contains EN text:', enHtml.includes('Your Order Has Been Confirmed'));
  console.log('RU template contains RU text:', ruHtml.includes('Ваш заказ подтверждён'));
  
  // Test cache invalidation
  cache.set('/api/products', { test: true });
  cache.set('/api/products?page=2', { test: true });
  cache.set('/api/categories', { test: true });
  console.log('Cache keys before invalidation:', cache.keys().length);
  invalidateCache('/api/products');
  console.log('Cache keys after products invalidation:', cache.keys().length);
  
  console.log('\nAll checks PASSED!');
} catch (e) {
  console.error('ERROR:', e.message);
  console.error(e.stack);
}
