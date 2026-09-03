package com.ahmedhossam.mnp.service;

import com.ahmedhossam.mnp.enums.Operator;

public interface PhoneHolderResolver {
    Operator resolveCurrentHolder(String phoneNumber);
}
