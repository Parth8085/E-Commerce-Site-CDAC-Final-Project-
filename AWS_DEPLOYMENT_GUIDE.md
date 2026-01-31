# 🚀 End-to-End AWS Deployment Guide

This guide will walk you through deploying your E-Commerce application to AWS. We will use **AWS CloudFormation** for the database, **AWS App Runner** for the backend, and **AWS Amplify** for the frontend.

---

## ✅ Prerequisites
1.  An [AWS Account](https://aws.amazon.com/).
2.  Your code pushed to GitHub (Already done!).

---

## 2️⃣ Step 1: Deploy the Database (RDS)
We will use the CloudFormation template provided in `deployment/aws-db.yaml` to create a free-tier MySQL database.

1.  Log in to the **AWS Console**.
2.  Search for **CloudFormation** and click **Create stack** > **With new resources (standard)**.
3.  **Template source**: Choose **Upload a template file**.
4.  **Upload**: Select `deployment/aws-db.yaml` from your project folder.
5.  **Next**:
    *   **Stack name**: `ecommerce-db`
    *   **Parameters**: Set a `DBPassword` (Write this down! You will need it). Leave others as default.
6.  Click **Next** through the options and **Submit**.
7.  Wait for the status to change to `CREATE_COMPLETE` (approx. 5-10 mins).
8.  **Important**: Go to the **Outputs** tab of the stack. Copy the `DBEndpoint` (it looks like `database-1.cluster-xyz.us-east-1.rds.amazonaws.com`).

---

## 3️⃣ Step 2: Deploy the Backend (AWS App Runner)
App Runner will automatically build and deploy your .NET API from GitHub.

1.  Search for **AWS App Runner** in the console.
2.  Click **Create an App Runner service**.
3.  **Source**: Select **Source code repository**.
4.  **Connect to GitHub**: Click **Add new** and authorize AWS to access your GitHub account. Select your repository (`E-Commerce-Site-CDAC-Final-Project-`).
5.  **Deployment settings**:
    *   **Branch**: `master`
    *   **Source directory**: `backend` (Select this folder!)
    *   **Deployment trigger**: Automatic (deploys when you push code).
6.  **Build settings**:
    *   **Runtime**: Managed runtime (select **.NET 8** or latest).
    *   **Build command**: `dotnet restore && dotnet publish -c Release -o out`
    *   **Start command**: `dotnet out/Backend.dll`
    *   **Port**: `8080`
7.  **Service configuration**:
    *   **Service name**: `ecommerce-backend`
    *   **Environment variables**: Add the following:
        *   `ConnectionStrings__DefaultConnection`: `server=DB_ENDPOINT;port=3306;database=ecommerce_db;user=admin;password=YOUR_PASSWORD;`
            *   *(Replace `DB_ENDPOINT` with the value from Step 1 Outputs)*
            *   *(Replace `YOUR_PASSWORD` with the password you set in Step 1)*
        *   `Jwt__Key`: `ThisIsASuperSecretKeyForMyEcommerceApp123!AndItMustBeLongEnough` (Or generate a new one)
        *   `Jwt__Issuer`: `https://YOUR_APP_RUNNER_URL` (You will get this URL after creation, you can update it later).
8.  Click **Next** and **Create & deploy**.
9.  Wait for it to finish. Copy the **Default domain** (e.g., `https://xyz.awsapprunner.com`). This is your **Backend URL**.

---

## 4️⃣ Step 3: Deploy the Frontend (AWS Amplify)
Amplify will host your React frontend.

1.  Search for **AWS Amplify** in the console.
2.  Click **Create new app** > **GitHub**.
3.  Authorize and select your repository.
4.  **Build settings**:
    *   Amplify should automatically detect the `frontend` folder. If not, edit the settings.
    *   Ensure `baseDirectory` is set to `frontend`.
    *   **Build command**: `npm install && npm run build`
    *   **Output directory**: `dist`
5.  **Environment Variables**:
    *   Expand the "Advanced settings" or "Environment variables" section.
    *   Key: `VITE_API_URL`
    *   Value: `https://YOUR_BACKEND_URL` (Paste the App Runner URL from Step 2. **Important**: No trailing slash `/` at the end).
6.  Click **Next** and **Save and deploy**.
7.  Amplify will build your site. Once done, you will get a URL (e.g., `https://main.app-id.amplifyapp.com`).

---

## 🎉 Done!
Your application is now live!
*   **Frontend**: The Amplify URL.
*   **Backend**: The App Runner URL.
*   **Database**: Managed by RDS.

### 🔄 Updating the App
Since we set up automatic deployments:
*   To update code: Just `git commit` and `git push`. App Runner and Amplify will automatically re-deploy.
