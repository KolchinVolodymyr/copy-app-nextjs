import {Button, Flex, FormGroup, Input, Panel, Form as StyledForm, Checkbox} from '@bigcommerce/big-design';
import {useState, ChangeEvent} from 'react';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import {useProductListAll} from '../../lib/hooks';
import { CSVLink } from 'react-csv';

interface FormProps {
    formData: FormData;
}

const importProducts = ({formData}: FormProps) => {
    const [form, setForm] = useState({ email: '', daily: false, weekly: false });

    const dataImportProduct = [];
    const { error, isLoading, list = [], meta = {}, mutateList=[] , context} = useProductListAll();

    if(!isLoading) {
        list.forEach((el)=>{
            dataImportProduct.push(...el.variants)
        })
//         console.log('dataImportProduct', dataImportProduct);
    }

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: formName, value } = event?.target;
        setForm(prevForm => ({ ...prevForm, [formName]: value }));
        //console.log('email form', form);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name: formName } = event?.target;
        setForm(prevForm => ({ ...prevForm, [formName]: checked }));
        console.log('handleCheckboxChange', form)
    };

    const onClickBtnSend = () => {
        fetch('http://localhost:8080', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({dataSCV: dataImportProduct, form: form, context: context})
        }).then((response)=> {
             console.log('response', response)
        }).catch((error)=> console.log('error', error))
          .finally(()=>{
               console.log('finally')
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
            <StyledForm>
                <Panel header="Send Big Commerce product import file by mail">
                    <FormGroup>
                        <Input
                            label="Enter Email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </FormGroup>
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
                        onChange={handleChange}
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
                        name="weekly"
                        checked={form.weekly}
                        onChange={handleCheckboxChange}
                        label="Send weekly (Monday-Friday only) "
                    />
                </FormGroup>
            </Panel>
        </Panel>
    );
};

export default importProducts;
