import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Checkbox, Message} from '@bigcommerce/big-design';
import {useState, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';

interface FormProps {
    formData: FormData;
}

const importProducts = ({formData}: FormProps) => {
    const [isShownSuccess, setIsShownSuccess] = useState(false);
    const [isShownError, setIsShownError] = useState(false);
    const [formEmail, setFormEmail] = useState({ email: '' });
    const [form, setForm] = useState({ email: '', daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });

    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();
    console.log('data', data);
    // console.log('accessToken+accessToken', accessToken);
    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
    }

    //if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setFormEmail(prevForm => ({ ...prevForm, [formName]: value }));
    };

    const handleChangeForm  = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       const { name: formName, value } = event?.target;
       setForm(prevForm => ({ ...prevForm, [formName]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name: formName } = event?.target;
        setForm({ email:form.email, daily: false, weekly: false, workingDay: false, monthly:false, unsubscribe: false });
        setForm(prevForm => ({ ...prevForm, [formName]: checked }));
    };

    const onClickBtnSend = () => {
        fetch('https://express-heroku-app-email.herokuapp.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dataSCV: dataImportProduct, formEmail: formEmail})
        }).then((response)=> {
            setIsShownSuccess(!isShownSuccess);
        }).catch((error)=> {
            setIsShownError(!isShownError);
        })
        .finally(()=>{
            console.log('finally');
        })
    }
    const onClickBtnSubscribe = () => {
        console.log('onClickBtnSubscribe');
        console.log("form", form);
        fetch('http://localhost:8080/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({form: form, accessToken:data.accessToken})
        })
        .then((data) => {
            console.log('Subscribe: data', data);
        }).catch((error)=> {
          console.log('Subscribe: error', error)
        })
        .finally(()=>{
            console.log('Subscribe: finally');
        })
    }

    return (
        <Panel>
            <Panel header="Download products BigCommerce">
                <CSVLink
                    data={dataImportProduct}
                    className="btn btn-primary"
                    filename={"BigCommerce-import-products.csv"}
                >
                    Download.csv
                </CSVLink>
            </Panel>
            <StyledForm onSubmit={handleSubmit}>
                <Panel header="Send BigCommerce product import file by mail">
                    <FormGroup>
                        <Input
                            label="Enter Email"
                            name="email"
                            required
                            value={formEmail.email}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    {isShownError &&
                        <Message
                            type="error"
                            messages={[{ text: 'An error occurred, the email was not sent. Please repeat again ' }]}
                            marginVertical="medium"
                        />
                    }
                    {isShownSuccess &&
                        <Message
                            type="success"
                            messages={[{ text: 'Email sent successfully ' }]}
                            marginVertical="medium"
                        />
                    }
                    <Flex justifyContent="flex-end">
                        <Button
                            type="submit"
                            onClick={onClickBtnSend}
                        >
                            Send Email
                        </Button>
                    </Flex>
                </Panel>
            </StyledForm>
            <Panel header="Subscribe to our newsletter">
                Get the latest updates on new products and stock level
                <FormGroup>
                    <Input
                        label="Enter Email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChangeForm}
                    />
                </FormGroup>
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
        </Panel>
    );
};

export default importProducts;
