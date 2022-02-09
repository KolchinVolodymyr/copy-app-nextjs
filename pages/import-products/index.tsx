import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Message} from '@bigcommerce/big-design';
import {useState, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';
import SubscribeForm from "@components/SubscribeForm";


const importProducts = () => {
    const [isShownSuccess, setIsShownSuccess] = useState(false);
    const [isShownError, setIsShownError] = useState(false);
    const [formEmail, setFormEmail] = useState({ email: '' });

    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[], data } = useProductListAll();

    const clientData = [];
    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
        clientData.push(process.env.CLIENT_ID);
    }

    // if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setFormEmail(prevForm => ({ ...prevForm, [formName]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const onClickBtnSend = (e) => {
        if(formEmail.email === '') {
            return;
        }
        if (e.target.nodeName || e.target.parentElement.nodeName == 'BUTTON') {
            e.target.setAttribute('disabled', 'true');
            e.target.parentElement.setAttribute('disabled', 'true');
        }
        // https://express-heroku-app-email.herokuapp.com/send
        // http://localhost:8080/send
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
            e.target.removeAttribute('disabled');
            e.target.parentElement.removeAttribute('disabled');
            setTimeout(() => {
                setIsShownSuccess(false);
                setIsShownError(false);
                setFormEmail({ email: '' });
            }, 4000);
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
                <Panel header="Send BigCommerce product import file by Email">
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

            <SubscribeForm data={data}/>
        </Panel>
    );
};

export default importProducts;
