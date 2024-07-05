
# Stock Price Prediction Project

## Overview

This project aims to predict stock prices using historical data and machine learning techniques.

## Setup

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Ensure you have a `.env` file in the root directory with the following variables:

```dotenv
URL=https://ost.ecosoftbd.com/core/api/v1/Ta/
COOKIE1=.ASPXAUTH=59D9EF7F3401B4C855E126C7897254D31BE78138524B3E2E8283B2D0034F1C3D605CE681AE50C3FC09C7FE8284B8321043EF85E62EA5DA1FE07A85AA5304B27F31E0E94AE249EC6043E387BB1135C37ABBE33BAB9F1B9580ED76A84312BB92D01D5DE7E20D29EC6522970C1CD6022D6E4197F8DA18D8375BBF4B20959E92FDE948F7164BC4AF24A195E4117D174FFE0B89E461428A5216E0; Path=/; HttpOnly;
COOKIE2=CoreAuth=CfDJ8CjnUl4361VFrtx2tu73DREh0W_yFV7phygiJ_IWKpyvgqpceo9DzprT_RyhV-WnZUuD_CSuyqaU6Kjg8RVJfusZyq4r5lUN-0eCLAthgNj5OmSqTBsUj5gmBVdw4r-48D5dL6dovRyWUiSoSDnFDhWSqBfI-Lxm0LI2aIaKhobEnHg70XTkAz9WSR-mwQ9ynjgWwkI_JFKH-ilyTdkKYY3Y2Ytw-YTjSX5h3psNTXrnNH0kdh42Kq4BN0Hu06KSGC7fOKxKya3OzEPDo1wTbmAdmOB8gU1gbE5-j7EBsY9Wx6GWCfOgpl7UWyQ4TRs_1d8Zq_49jhJc6vSd7RcJQms; Path=/;
COOKIE3=LastLoginId=saleh.sust.bd; Path=/;
COOKIE4=LastUserName=saleh.sust.bd [Ebrahim Mohammad Saleh]; Path=/;
COOKIE5=lastCoreAuthTime=Fri Jul 05 2024 02:41:58 GMT+0600 (Bangladesh Standard Time); Path=/;
COOKIE6=app-theme=light; Path=/;
COOKIE7=tz=360; Path=/;
COOKIE8=tz=360; Path=/BoAccount/Detail;
COOKIE9=tz=360; Path=/OnlinePayment/GiftStatus;
COOKIE10=tz=360; Path=/User/Detail;
```

### Usage

1. Run the main script to fetch and process data:
   ```bash
   node main.js
   ```

2. The script will fetch historical stock data using Axios, process it to extract relevant information, and save it as JSON and Excel files.

### Folder Structure

- `main.js`: Main script for fetching, processing, and saving stock data.
- `save_file/`: Directory where JSON and Excel files are saved.

## Notes

- Ensure the `.env` file is correctly set up with the required URL and cookies.
- Adjust the parameters and cookies in `main.js` as needed for different stock symbols or time periods.

---
