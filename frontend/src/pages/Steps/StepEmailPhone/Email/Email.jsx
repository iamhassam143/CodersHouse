import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepEmailPhone.module.css';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../../../../http';
import { setOtp } from '../../../../store/authSlice';

const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    async function submit(e) {
        e.preventDefault();
        if (!email) return;
        const { data } = await sendOtp({ email: email });
        dispatch(setOtp({ email: data.email, phone: data.phone, hash: data.hash }));
        onNext();
    }

    return (
        <form onSubmit={submit}>
            <Card title="Enter your email id" icon="email-emoji">
                    <TextInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div>
                        <div className={styles.actionButtonWrap}>
                            <Button text="Next" />
                        </div>
                        <p className={styles.bottomParagraph}>
                            By entering your email, you’re agreeing to our Terms of
                            Service and Privacy Policy. Thanks!
                        </p>
                    </div>
            </Card>
        </form>
    );
};

export default Email;
