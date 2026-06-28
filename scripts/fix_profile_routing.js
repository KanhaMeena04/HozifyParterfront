const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '..', 'src', 'app', '(dashboard)');

const profileSubPages = [
  'payment-method.tsx',
  'safety.tsx',
  'referral.tsx',
  'hozify-rewards.tsx',
  'rewards-plan.tsx',
  'settings.tsx',
  'earnings.tsx',
  'incentives.tsx',
  'my-rating.tsx',
  'demand-planner.tsx',
  'service-manager.tsx',
  'emergency-contacts.tsx',
  'rate-card.tsx',
  'help-advanced.tsx',
  'profile-details.tsx',
  'passbook.tsx',
  'referral-passbook.tsx'
];

let modifiedCount = 0;

for (const page of profileSubPages) {
  const filePath = path.join(DASHBOARD_DIR, page);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // 1. Replace router.back() in UI (usually in onPress={() => router.back()})
    content = content.replace(/onPress=\{[^{}]*router\.back\(\)[^{}]*\}/g, "onPress={() => router.push('/(dashboard)/profile')}");
    
    // Also if there's any direct router.back() call that wasn't caught
    // Some might be inside handleBack functions. Let's do a more general replace for the UI buttons
    content = content.replace(/router\.back\(\)/g, "router.push('/(dashboard)/profile')");

    // 2. We injected useAndroidBack(); earlier. Let's replace it with useAndroidBack(() => router.push('/(dashboard)/profile'));
    content = content.replace(/useAndroidBack\(\);/g, "useAndroidBack(() => router.push('/(dashboard)/profile'));");

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      modifiedCount++;
    }
  }
}

console.log(`Successfully updated ${modifiedCount} profile sub-pages to route back to profile.`);
