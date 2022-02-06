import { Button, Checkbox, Flex, FormGroup, Input, Panel, Select, Form as StyledForm, Textarea } from '@bigcommerce/big-design';

import { useRouter } from 'next/router';
import {ReactElement, useState, useEffect, useMemo, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from "react-csv";
// import Crontab from 'reactjs-crontab';
// import 'reactjs-crontab/dist/index.css';
// import { SMTPClient } from 'emailjs';
import emailjs from '@emailjs/browser';
import {FormData} from "@types";

interface FormProps {
    formData: FormData;
    onCancel(): void;
    onSubmit(form: FormData): void;
}

const importProducts = ({ formData, onCancel, onSubmit }: FormProps) => {
    // Get the router object
    // const router = useRouter();
    // const [email, setEmail] = useState('');
    // const { email } = formData;
    // const { description, type, email}= formData;
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

    // const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     // const { name: formName, value } = event?.target;
    //     // setForm(prevForm => ({ ...prevForm, [formName]: value }));
    //     console.log('event?.target', event?.target);
    //     console.log('event', event);
    //     setEmail(event?.target);
    // };
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
