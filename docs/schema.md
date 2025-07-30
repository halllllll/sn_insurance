```mermaid
---
title: SN Database
---
erDiagram
  user{
    text id
    email email
    bool emailVisibility 
    string name
    bool verified
    text name
    image avatar
    datetime created
    datetime updated
  }
  
  serial_number{
    text id
    text serial_number
    bool is_assuarance
    datetime created
    datetime updated
  }

```