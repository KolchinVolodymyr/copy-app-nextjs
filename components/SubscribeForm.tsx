import { Panel, Flex, FormGroup, Input, Message, Checkbox, Button } from '@bigcommerce/big-design';
import {ChangeEvent, useState} from "react";

const SubscribeForm = (data) => {
    console.log('data', data);
    const [isShownSuccessSubscribe, setIsShownSuccessSubscribe] = useState(false);
    const [isShownErrorSubscribe, setIsShownErrorSubscribe] = useState(false);
    const [isLoadingSubscribeShowEmail, setIsLoadingSubscribeShowEmail] = useState(false);
    const [isLoadingSubscribeShowCheckbox, setIsLoadingSubscribeShowCheckbox] = useState(false);
    const [form, setForm] = useState({ email: '', daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });

    const handleChangeForm  = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setForm(prevForm => ({ ...prevForm, [formName]: value }));
        setIsLoadingSubscribeShowEmail(false);
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name: formName } = event?.target;
        setForm({ email:form.email, daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });
        setForm(prevForm => ({ ...prevForm, [formName]: checked }));
        setIsLoadingSubscribeShowCheckbox(false);
    };

    const onClickBtnSubscribe = (e) => {
        console.log('form', form)
        if(form.email === '' ) {
            setIsLoadingSubscribeShowEmail(true);
            return;
        }
        if (form.daily === false && form.weekly === false && form.workingDay === false && form.monthly=== false && form.unsubscribe === false) {
            console.log('checkbox');
            setIsLoadingSubscribeShowCheckbox(true);
            return;
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }
        fetch('https://express-heroku-app-email.herokuapp.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                form: form,
                accessToken: data?.accessToken,
                storeHash: data?.storeHash,
                clientID: process.env.CLIENT_PUBLIC_ID
            })
        })
            .then((data) => {
                setIsShownSuccessSubscribe(!isShownSuccessSubscribe);
            }).catch((error)=> {
            setIsShownErrorSubscribe(!isShownErrorSubscribe);
        })
            .finally(()=>{
                e.target.removeAttribute('disabled');
                e.target.parentElement.removeAttribute('disabled');
                setIsLoadingSubscribeShowCheckbox(false);
                setIsLoadingSubscribeShowEmail(false);
                setTimeout(() => {
                    setIsShownSuccessSubscribe(false);
                    setIsShownErrorSubscribe(false);
                    setForm({ email:'', daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });
                }, 4000);
            })
    }

    return (
        <Panel header="Subscribe to our newsletter">
            <p>Get the latest updates on new products and stock level</p>
            <FormGroup>
                <Input
                    label="Enter Email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChangeForm}
                />
            </FormGroup>
            {isShownSuccessSubscribe &&
                <Message
                    type="success"
                    messages={[{ text: 'Email sent successfully ' }]}
                    marginVertical="medium"
                />
            }
            {isShownErrorSubscribe &&
                <Message
                    type="error"
                    messages={[{ text: 'An error occurred, the email was not sent. Please repeat again ' }]}
                    marginVertical="medium"
                />
            }
            {isLoadingSubscribeShowEmail &&
                <Message
                    type="warning"
                    messages={[{ text: 'Email field is empty, please enter your email ' }]}
                    marginVertical="medium"
                />}
            <FormGroup>
                <Checkbox
                    name="daily"
                    checked={form.daily}
                    onChange={handleCheckboxChange}
                    label="Send daily"
                />
                <Checkbox
                    name="workingDay"
                    checked={form.workingDay}
                    onChange={handleCheckboxChange}
                    label="Send daily (Monday through Friday only) "
                />
                <Checkbox
                    name="weekly"
                    checked={form.weekly}
                    onChange={handleCheckboxChange}
                    label="Sending weekly (1 email per week)"
                />
                <Checkbox
                    name="monthly"
                    checked={form.monthly}
                    onChange={handleCheckboxChange}
                    label="Sending monthly "
                />
                <Checkbox
                    name="unsubscribe"
                    checked={form.unsubscribe}
                    onChange={handleCheckboxChange}
                    label="Unsubscribe from mailing list "
                />
                {isLoadingSubscribeShowCheckbox &&
                    <Message
                        type="warning"
                        messages={[{ text: 'Choose one of the subscription options (every day, once a week, etc.)' }]}
                        marginVertical="medium"
                    />
                }
                <Flex justifyContent="flex-end">
                    <Button
                        type="submit"
                        onClick={onClickBtnSubscribe}
                    >
                        Subscribe
                    </Button>
                </Flex>
            </FormGroup>
        </Panel>
    )
}

export default SubscribeForm;
