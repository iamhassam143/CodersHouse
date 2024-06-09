import 'react-phone-number-input/style.css'
import './Phone.module.css'
import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepEmailPhone.module.css';
import PhoneInput from 'react-phone-number-input';
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();

    async function submit(e) {
        e.preventDefault();
        if (!phoneNumber) return;
        const { data } = await sendOtp({ phone: phoneNumber });
        dispatch(setOtp({ email: data.email, phone: data.phone, hash: data.hash }));
        onNext();
    }

    return (
        <form onSubmit={submit}>
            <Card title="Enter your Phone Number" icon="phone">
                {/* <TextInput
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                /> */}
                <PhoneInput
                    defaultCountry='IN'
                    onChange={setPhoneNumber}
                />

                <div>
                    <div className={styles.actionButtonWrap}>
                        <Button text="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your phone number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </div>
            </Card>
        </form>
    );
};

export default Phone;
