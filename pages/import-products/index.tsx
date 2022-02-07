import { Button, Flex, FormGroup, Input, Panel, Form as StyledForm } from '@bigcommerce/big-design';

import {useState, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from "react-csv";

import emailjs from '@emailjs/browser';


interface FormProps {
    formData: FormData;
}

const importProducts = ({ formData}: FormProps) => {
    const [form, setForm] = useState({ email: '' });
    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[] } = useProductListAll();

    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
        console.log('dataImportProduct', dataImportProduct);
    }

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setForm(prevForm => ({ ...prevForm, [formName]: value }));
        console.log('email form', form);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const onClickBtnSend = () => {
        console.log('hi onClickBtnSend');

        fetch('http://localhost:8080/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dataSCV: dataImportProduct, email: form.email})
        }).then((response)=> {
            console.log('response', response)
        }).catch((error)=> console.log('error', error))
          .finally(()=>{
              console.log('finally')
          })
    }

    return (
        <Panel>
            Import products:
            <CSVLink data={dataImportProduct}>Download.csv</CSVLink>
            <StyledForm onSubmit={handleSubmit}>
                <Panel header="Basic Information">
                    <FormGroup>
                        <Input
                            label="Enter Email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Panel>

                <Flex justifyContent="flex-end">
                    <Button
                        type="submit"
                        onClick={onClickBtnSend}
                        // onClick={() => router.push('http://localhost:8080/send')}
                    >
                        Send Email
                    </Button>
                </Flex>
            </StyledForm>
        </Panel>
    );
};

export default importProducts;
