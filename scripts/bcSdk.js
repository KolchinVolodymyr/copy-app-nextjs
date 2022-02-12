import $ from 'jquery';
// import cron from 'jquery-cron';

export function bigCommerceSDK(context) {

        console.log('111111111111111111');
        // console.log('cron', cron);
    if (typeof window === "undefined") return;
    console.log('222222222222222');
    console.log('window', window)
    const s = 'script';
    const id = 'bigcommerce-sdk-js';
    const d = document;
    let js, bcjs = d.getElementsByTagName(s)[0];
    console.log('d', d);
    if (d.getElementById(id)) return;
    console.log('$$$',$);

    js = d.createElement(s);
    console.log('js', js);

    js.id = id;
    js.async = true;
    js.src = "https://cdn.bigcommerce.com/jssdk/bc-sdk.js";
    bcjs.parentNode.insertBefore(js, bcjs);

    $(document).ready(function() {
        // $('#selector')
        console.log('Hi !');
        console.log('$(h2)', $('h2'));
        console.log('my-custom-id', $('#my-custom-id'))
    });

    window.bcAsyncInit = function() {
        Bigcommerce.init({
            onLogout: function() {
                fetch(`/api/logout?context=${context}`);
            },
        });
    }
}
