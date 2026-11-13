# Google Tag Manager (GTM) API Integration & Automation Guide

Yeh guide batati hai ki kaise Google Tag Manager (GTM) API v2 ka use karke apne container (`GTM-59C7X2VD`) ko Python ke zariye 100% programmatically control aur automate karein.

---

## Architecture Overview

```
┌─────────────────────────────────┐
│     Google Cloud Console        │
│   (Service Account + API Key)   │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐       GTM API v2       ┌───────────────────────────────┐
│     Python Automation Script    ├───────────────────────►│  Google Tag Manager Container  │
│   (scripts/gtm_manager.py)      │                        │  • Account: 6399607689        │
└─────────────────────────────────┘                        │  • Container: 283356441       │
                                                           │  • Public ID: GTM-59C7X2VD   │
                                                           └──────────────┬────────────────┘
                                                                          │ Injects
                                                                          ▼
                                                           ┌───────────────────────────────┐
                                                           │  • Google Analytics 4 (GA4)   │
                                                           │  • Microsoft Clarity          │
                                                           │  • Lead Conversion Triggers   │
                                                           └───────────────────────────────┘
```

---

## Step 1: Google Cloud Console Setup (2 Minutes)

GTM API use karne ke liye ek Service Account create karna hota hai:

1. **[Google Cloud Console](https://console.cloud.google.com/)** open karein.
2. Upar project dropdown me apna project select karein ya naya project banayein (`CSEEL`).
3. **APIs & Services > Library** par jayein.
4. **"Google Tag Manager API"** search karein aur **Enable** button par click karein.
5. **APIs & Services > Credentials** par jayein.
6. Click **Create Credentials > Service Account**:
   - Service account name: `gtm-automator`
   - Role: `Owner` ya `Editor` (optional)
   - Click **Done**.
7. Jo naya Service Account bana hai uspe click karein -> **Keys** tab me jayein:
   - Click **Add Key > Create new key**
   - Key type: **JSON**
   - Click **Create**.
8. Aapke computer par ek `.json` file download hogi. 
   - Is file ko rename karke **`credentials.json`** rakh dein aur project root folder me paste kar dein:
     ```
     d:\Projects\cseel_next\cseel-next\credentials.json
     ```

---

## Step 2: Service Account ko GTM me Permission Dena (Crucial)

Service account ka ek email hota hai (jaise: `gtm-automator@your-project.iam.gserviceaccount.com`). Is email ko Tag Manager me Admin banana hota hai:

1. **[tagmanager.google.com](https://tagmanager.google.com/)** open karein.
2. Upar **`Admin`** tab par click karein.
3. Left column (Account) ya Right column (Container) me **`User Management`** par click karein.
4. Top right corner me **`+` (Add users)** par click karein.
5. **Email Address** me Service Account ka email paste karein.
6. **Account Permissions** me **`Administrator`** select karein.
7. **Container Permissions** me **`Publish` / `Administrator`** select karein.
8. Click **`Save`**.

---

## Step 3: Python Script se 100% Automate Karna

Humne aapke project me ready-to-run automation script bana di hai: [`scripts/gtm_manager.py`](../scripts/gtm_manager.py).

### Script Execution Commands:

#### 1. Accounts & Container Check Karein:
```bash
python scripts/gtm_manager.py --action list
```

#### 2. Saare Tags Auto-Setup & Live Publish Karein (GA4 + Clarity + Triggers):
```bash
python scripts/gtm_manager.py --action setup
```
Yeh command automatically:
* Google Analytics 4 Tag (`G-LYST8M89SF`) create karega.
* Microsoft Clarity Tag (`z2ie9rhdco`) create karega.
* Built-in `All Pages` trigger connect karega.
* Ek naya Version banayega (`Auto-Deploy: GA4 & Clarity Tracking`).
* Version ko **Live Publish** kar dega!

---

## Step 4: Security & Best Practices

1. **`.gitignore` Protection:**
   Aapki `credentials.json` file ko kabhi bhi Git / GitHub par push na karein. Verify karein ki `.gitignore` me added hai:
   ```gitignore
   # Google Cloud Service Account Credentials
   credentials.json
   *.pem
   *.key
   ```

2. **Environment Variable Fallback:**
   Production ya CI/CD environments me aap JSON file ki jagah raw JSON string environment variable me daal sakte hain:
   ```bash
   GTM_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'
   ```
