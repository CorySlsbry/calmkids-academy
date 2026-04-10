# Play Store Deployment Guide — CalmKids Academy
## Kids Category (Designed for Families)

> App ID: `com.coryslsbry.calmkidsacademy`
> Target audience: Children ages 2–8
> Content rating: Everyone (E)
> Last updated: April 2026

---

## Overview

CalmKids Academy targets the **Google Play "Designed for Families" program**, which applies
stricter requirements than standard app listings. Non-compliance results in app removal.
Every item below is **required** — not optional.

---

## 1. Prerequisites (complete before submitting)

### 1a. Privacy Policy
- [ ] Host a privacy policy at a **stable public URL** (e.g., `https://calmkids-academy.app/privacy`)
- [ ] Policy must explicitly state:
  - What data is collected from children under 13
  - How parental consent is obtained and verified
  - How data is deleted on request
  - Contact email for privacy requests
- [ ] Reference COPPA compliance by name
- [ ] Enter the URL in **Play Console → App content → Privacy policy**

### 1b. Keystore (signing certificate)
- [ ] Generate a release keystore:
  ```bash
  keytool -genkeypair -v \
    -keystore calmkids-release.keystore \
    -alias calmkids \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000
  ```
- [ ] **Back up the keystore file and passwords securely.** Losing the keystore locks you out
      of future updates permanently — Google cannot recover it.
- [ ] Configure in `capacitor.config.ts` or via `android/app/build.gradle` signing config

---

## 2. Build steps

```bash
# 1. Install dependencies
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Static export
npm run build
# Outputs to: out/

# 3. Sync to Android
npx cap sync android

# 4. Open in Android Studio (or build via CLI)
npx cap open android
# OR
cd android && ./gradlew assembleRelease
```

---

## 3. AndroidManifest.xml — Minimum permissions

Location: `android/app/src/main/AndroidManifest.xml`

Kids apps must request **minimum permissions**. Remove anything not strictly required.

```xml
<!-- REQUIRED: network access for API calls, lesson sync, Stripe -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Remove ALL of these unless the feature is actually used: -->
<!-- android.permission.ACCESS_FINE_LOCATION     ← not needed -->
<!-- android.permission.ACCESS_COARSE_LOCATION   ← not needed -->
<!-- android.permission.READ_CONTACTS            ← not needed -->
<!-- android.permission.WRITE_CONTACTS           ← not needed -->
<!-- android.permission.CAMERA                  ← not needed -->
<!-- android.permission.RECORD_AUDIO            ← not needed (unless voice feature) -->
<!-- android.permission.READ_EXTERNAL_STORAGE   ← not needed -->
<!-- android.permission.WRITE_EXTERNAL_STORAGE  ← not needed -->
```

**Why this matters:** The Play Store Kids review team manually checks permission requests.
Unnecessary permissions are an automatic rejection reason for the Families program.

---

## 4. Play Console — App content settings

Navigate to **Play Console → [app] → App content** and complete all sections:

### 4a. Target audience and content
- [ ] **Target age group**: Children (ages up to 12)
- [ ] This selection triggers automatic **Families Policy** requirements
- [ ] Additional confirmation: "Does your app target children?" → **Yes**

### 4b. Content rating questionnaire
Complete the **IARC content rating questionnaire**:
- Category: **Education**
- Violence: None
- Sexual content: None
- Profanity: None
- **Expected result**: "Everyone (E)"

A rating of Everyone is required for the Designed for Families badge.

### 4c. Ads declaration
- [ ] Go to **App content → Ads**
- [ ] Select: **"My app does not contain ads"**
- This must be truthful. Zero behavioral ads, zero ad SDKs, zero mediation networks.
  Violating this with a kids-targeted app is a permanent account strike.

### 4d. Data Safety form (required)
Navigate to **Play Console → [app] → Data safety** and complete:

| Data type              | Collected? | Shared with 3rd parties? | Encrypted? | Deletion supported? |
|------------------------|-----------|--------------------------|-----------|---------------------|
| Name                   | No        | —                        | —         | —                   |
| Email address          | Yes (parent only) | No               | Yes       | Yes, on request     |
| User IDs               | Optional (parent account) | No   | Yes       | Yes                 |
| App activity (in-app usage) | Yes (aggregated, anonymized) | No | Yes | Yes              |
| Crash logs             | Yes       | No (on-device only)      | Yes       | Yes                 |

Key declarations:
- [ ] Check: **"Data is not sold to third parties"**
- [ ] Check: **"Data is not used for tracking across apps"**
- [ ] Check: **"Data is not used for advertising purposes"**
- [ ] Select: **"Data can be deleted by users"** → provide deletion instructions

### 4e. Families self-certification
- [ ] Navigate to **App content → Families self-certification**
- [ ] Certify compliance with all Families Policy requirements:
  - No behavioral advertising
  - No data collection beyond what's necessary for app function
  - No deceptive design patterns (no dark patterns targeting children)
  - Appropriate content for the stated age group
  - Parental controls and consent mechanisms in place

---

## 5. Families Policy requirements (non-negotiable)

These are not suggestions — violations cause immediate removal:

### 5a. COPPA compliance
- [ ] **No personal data from children under 13** without verifiable parental consent
- [ ] The account holder must always be the parent/guardian (children cannot create accounts)
- [ ] Parental consent must be verifiable (email confirmation at minimum; credit card verification for higher-risk data)
- [ ] Implement a data deletion mechanism for child data
- [ ] Document your COPPA compliance in the privacy policy

### 5b. Advertising prohibition
- [ ] **Zero interest-based / behavioral advertising** in apps targeting children
- [ ] **Zero contextual advertising** in apps targeting children under 13 (exception: on-device
      contextual ads from Google's families-certified ad network — requires separate certification)
- [ ] No third-party ad SDKs (AdMob, Meta Audience Network, IronSource, AppLovin, etc.)
- [ ] No ad mediation networks
- [ ] No affiliate tracking pixels

### 5c. Content requirements
- [ ] All content appropriate for children ages 2–8
- [ ] No depictions of violence, drug use, alcohol, gambling, or adult themes
- [ ] No links out to the web from within the kids' interface (parent dashboard may link externally;
      the children's UI may not)
- [ ] No social features (chat, user-generated content) in the children's UI without parental controls

### 5d. Deceptive design prohibition
Google explicitly bans these in kids apps:
- [ ] No "virtual currencies" that obscure real monetary value
- [ ] No countdown timers designed to pressure purchases
- [ ] No false urgency ("Only 3 spots left!")
- [ ] No loot boxes or random-reward mechanics
- [ ] No "social proof manipulation" targeting children
- [ ] No requests to share to social media from within the children's UI

### 5e. In-app purchases
- [ ] All in-app purchases must be initiated by the parent (biometric, password, or PIN confirmation)
- [ ] Subscriptions must be clearly labeled as recurring charges
- [ ] Cancellation must be easy and clearly explained (1-tap Google Play cancellation satisfies this)

---

## 6. Store listing requirements

### 6a. Title and description
- Title must not be misleading about content
- Description must clearly state the target age range
- Include COPPA/privacy statements in the description

### 6b. Screenshots and video
- Screenshots must accurately represent current app state (no mockup-only screens)
- At least 2 phone screenshots + 2 tablet screenshots recommended
- Feature graphic (1024×500): upload in Play Console

### 6c. App icon
- 512×512 PNG, no alpha
- Adaptive icon required (foreground + background layers):
  - `android/app/src/main/res/mipmap-*/ic_launcher.xml`
  - Foreground: `ic_launcher_foreground.xml` or PNG
  - Background: `ic_launcher_background.xml` (solid color: `#FEF3C7`)

---

## 7. Teachers Approved program (optional but valuable)

If the curriculum is validated by licensed educators, consider applying for:
- **Google Play for Education** listing
- **Teachers Approved** badge (requires educator validation and external review)
- **Common Sense Media** rating submission (free; boosts parent trust)

---

## 8. Post-submission checklist

- [ ] Respond to Play Store review feedback within 7 days
- [ ] Monitor the **Policy status** tab for any compliance flags
- [ ] Keep the privacy policy URL live and updated
- [ ] Update the Data Safety form any time data practices change
- [ ] Re-certify Families compliance after any SDK additions
- [ ] Test on a physical $50 Android device (Amazon Fire HD 8 or equivalent) before each release

---

## 9. Manual steps required by the developer

The following cannot be automated and must be completed manually:

| Step | Where | Status |
|------|--------|--------|
| Generate and secure release keystore | Local machine | ⬜ Not done |
| Host privacy policy at stable URL | Your web host / Vercel | ⬜ Not done |
| Complete Play Console account setup | play.google.com/console | ⬜ Not done |
| Upload app bundle (.aab) to internal testing | Play Console | ⬜ Not done |
| Complete Data Safety form | Play Console → Data safety | ⬜ Not done |
| Complete Families self-certification | Play Console → App content | ⬜ Not done |
| Complete IARC content rating | Play Console → App content | ⬜ Not done |
| Set "Designed for Families" opt-in | Play Console → App content | ⬜ Not done |
| Upload adaptive icon assets | Android Studio / res/ folders | ⬜ Not done |
| Upload screenshots and feature graphic | Play Console → Store listing | ⬜ Not done |
| Set $4.99/month subscription pricing | Play Console → Monetization | ⬜ Not done |
| Configure free trial (14 days) in Play Billing | Play Console → Monetization | ⬜ Not done |
| Test purchase flow on physical device | Physical device + test account | ⬜ Not done |
| Submit for review | Play Console → Release | ⬜ Not done |

---

## 10. Useful links

- Families Policy: https://support.google.com/googleplay/android-developer/answer/9893335
- COPPA guidance: https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy
- IARC rating system: https://www.globalratings.com
- Data Safety form guidance: https://support.google.com/googleplay/android-developer/answer/10787469
- Adaptive icons: https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive
- Play Billing for subscriptions: https://developer.android.com/google/play/billing/subscriptions
