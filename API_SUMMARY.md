# API Endpoints Summary

## Driver > driver-new-order
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/driver-new-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
None

---

## Driver > driver-shipping-order
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/driver-shipping-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
None

---

## Driver > driver-complete-order
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/driver-complete-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
None

---

## Driver > create-offer
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/create-offer?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- request_id: 27
- price: 200

---

## Driver > uploud-image-before
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/upload-image-before?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- reqeust_id: 27
- image[]: [FILE]

---

## Driver > start-order
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/start-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- request_id: 27

---

## Driver > end-order
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/end-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- request_id: 27

---

## Driver > upload-image-after
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/upload-image-after?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- reqeust_id: 27
- image[]: [FILE]

---

## Driver > customer-signature
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/customer-signature?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- request_id: 27
- signature: [FILE]
- confirm_code: 7309

---

## Driver > rate-customer
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/rate-customer?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`
- **Headers:**
None
- **Body:**
Mode: formdata
- reqeust_id: 27
- rate: 5
- comment: comment

---

## Driver > add-vehicle
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/add-vehicle?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`

- **Body:**
Mode: formdata
- truck_id: 
- sub_truck_id: 
- plate_number: 
- name: 
- mobile: 
- email: 
- year_manufacture:
- color: 
- capacity: 
- description: 
- type: ك دروب داون 1=>new,2=>used
- driving_license: [FILE]
- insurance: [FILE]
- car_registration: [FILE]

---

## Driver > update-vehicle
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/update-vehicle?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`

- **Body:**
Mode: formdata
- user_id: 
- truck_id: 
- sub_truck_id: 
- plate_number: 
- name: 
- mobile: 
- email: 
- year_manufacture: 
- color: 
- capacity: 
- description: 
- type: ك دروب داون 1=>new,2=>used
- driving_license: [FILE]
- insurance: [FILE]
- car_registration: [FILE]

---

## Driver > view-vehicle
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/veiw-vehicle?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c85`

---

## company > signup driver
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/signup-driver`
- **Headers:**
None
- **Body:**
Mode: formdata
- name: amr
- last_name: alrajihi
- username: alrajihi
- email: alrajihi@gmail.com
- mobile: 011234544
- password: 123456
- password_repeat: 123456
- country_id: 1
- city_id: 1
- license_number: 1
- experience_year: 
- address: 

---

## company > add-vehicle
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/add-vehicle?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c88`
- **Headers:**
None
- **Body:**
Mode: formdata
- driver_id: 257
- truck_id: 3
- sub_truck_id: 3
- plate_number: 12345
- name: amr
- mobile: 0113455
- email: alrajihi@gmail.com
- year_manufacture: 2026
- color: red
- capacity: 30
- description: asf
- type: 1
- driving_license: [FILE]
- insurance: [FILE]
- car_registration: [FILE]

---

## company > company-vehicle
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/company-vehicle?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c88`
- **Headers:**
None
- **Body:**
None

---

## company > company-driver
- **Method:** GET
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/company-driver?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c88`
- **Headers:**
None
- **Body:**
None

---

## company > company-order
- **Method:** POST
- **URL:** `https://alrajihy.com/demo/jsor/api/web/v1/site/company-order?access-token=8wA8SVa3ErF98JKtFsG2j_zTin4H8c88`
- **Headers:**
None
- **Body:**
Mode: formdata
- type: 1
- status: 1
- date_from: 2026-01-01
- date_to: 2026-02-30

---
