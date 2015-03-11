!function(r){r.fn.valideater=function(e,a){function o(){r("[data-valideater]",t).each(function(){for(var e=r(this),a=e.attr("data-valideater"),o=a.split(","),t=0;t<o.length;t++){var s=o[t];n[s]&&n[s](e)}}),n.processErrors()}var t=this;t.attr("novalidate","");var s={errorMessages:{alpha:"Just letters in here please",alphanumeric:"We need letters and numbers here please",dob:"All numbers in here please",age:"Whoops. You must be 18 or over",email:"That email doesn't look right, please try again",matches:"Oh no! These fields don't match!",numeric:"Just numbers in here please",password:"At least 4 characters please",postcode:"That postcode doesn't look right, please try again",radio:"Please choose an option",required:"This information is required"}};r.extend(s,a||e);var n={formErrors:!1,init:function(){return t.on("submit",function(){n.formErrors=!1;for(var e in n.errors)n.errors[e]=[];if(o(),n.formErrors){r("[data-valideater]",t).on("change keyup",function(){o()});var a=r(".error:first");return a.is("input, select, textarea, button")?a.focus():a.find("input, select, textarea, button").focus(),!1}return!0})},errors:{alpha:[],alphanumeric:[],dob:[],age:[],email:[],matches:[],numeric:[],password:[],postcode:[],radio:[],required:[]},required:function(e){var a=r(e).attr("placeholder");""===e.val()||e.val()===a?-1===r.inArray(e,n.errors.required)&&(n.errors.required.push(e[0]),n.formErrors=!0):(n.hideError(e,"required"),n.errors.required=r.grep(n.errors.required,function(r){return r!==e[0]}))},radio:function(e){var a=!1,o=function(){return this.checked},t=r("input[type=radio]",e);t.filter(o).length&&(a=!0),a===!1?-1===r.inArray(e,n.errors.radio)&&(n.errors.radio.push(e[0]),n.formErrors=!0):(n.hideError(e,"radio"),n.errors.radio=r.grep(n.errors.radio,function(r){return r!==e[0]}))},dob:function(e){for(var a=e.children("input, select"),o=!1,t=0;t<a.length;t++){var s=r(a[t]),i=s.val();if(""===i||isNaN(i))o=!0;else if(t===a.length-1){var l=new Date,u=new Date(r(a[2]).val(),r(a[1]).val()-1,r(a[0]).val()),d=l.getFullYear()-u.getFullYear();(l.getMonth()-u.getMonth()<0||l.getMonth()-u.getMonth()===0&&l.getDate()<u.getDate())&&d--,(d>100||r(a[1]).val()-1>12||r(a[0]).val()>31)&&(o=!0)}}o===!0?-1===r.inArray(e,n.errors.dob)&&(n.errors.dob.push(e[0]),n.formErrors=!0):(n.hideError(e,"dob"),n.errors.dob=r.grep(n.errors.dob,function(r){return r!==e[0]}))},age:function(e){for(var a=e.children("input, select"),o=!1,t=0;t<a.length;t++){{var s=r(a[t]);s.val()}if(t===a.length-1){var i=new Date,l=new Date(r(a[2]).val(),r(a[1]).val()-1,r(a[0]).val()),u=i.getFullYear()-l.getFullYear();(i.getMonth()-l.getMonth()<0||i.getMonth()-l.getMonth()===0&&i.getDate()<l.getDate())&&u--,18>u&&(o=!0)}}o===!0?-1===r.inArray(e,n.errors.age)&&(n.errors.age.push(e[0]),n.formErrors=!0):(n.hideError(e,"age"),n.errors.age=r.grep(n.errors.age,function(r){return r!==e[0]}))},alpha:function(e){var a=e.val(),o=/^[a-zA-Z]+$/;o.test(a)===!1&&""!==a?-1===r.inArray(e,n.errors.alpha)&&(n.errors.alpha.push(e[0]),n.formErrors=!0):(n.hideError(e,"alpha"),n.errors.alpha=r.grep(n.errors.alpha,function(r){return r!==e[0]}))},numeric:function(e){isNaN(e.val())?-1===r.inArray(e,n.errors.numeric)&&(n.errors.numeric.push(e[0]),n.formErrors=!0):(n.hideError(e,"numeric"),n.errors.numeric=r.grep(n.errors.numeric,function(r){return r!==e[0]}))},alphanumeric:function(e){var a=/^[a-zA-Z\d]+$/;a.test(e.val())===!1?-1===r.inArray(e,n.errors.alphanumeric)&&(n.errors.alphanumeric.push(e[0]),n.formErrors=!0):(n.hideError(e,"alphanumeric"),n.errors.alphanumeric=r.grep(n.errors.alphanumeric,function(r){return r!==e[0]}))},email:function(e){var a=e.val(),o=/^([A-Za-z0-9_\'\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,t=r(e).attr("placeholder");o.test(a)===!1&&""!==a&&a!==t?-1===r.inArray(e,n.errors.email)&&(n.errors.email.push(e[0]),n.formErrors=!0):(n.hideError(e,"email"),n.errors.email=r.grep(n.errors.email,function(r){return r!==e[0]}))},postcode:function(e){var a=e.val(),o=/(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,2}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))/i,t=a.indexOf(" ")>=0,s=0;s=t?8:7,o.test(a)===!1||a.length>s?-1===r.inArray(a,n.errors.postcode)&&(n.errors.postcode.push(e[0]),n.formErrors=!0):(n.hideError(e,"postcode"),n.errors.postcode=r.grep(n.errors.postcode,function(r){return r!==e[0]}))},password:function(e){var a=e.val();a.length<4&&""!==a?(n.errors.password.push(e[0]),n.formErrors=!0):(n.hideError(e,"password"),n.errors.password=r.grep(n.errors.password,function(r){return r!==e[0]}))},matches:function(e){var a=e.val(),o=e.attr("data-valideater-matches"),t=r("#"+o).val();a!==t?(n.errors.matches.push(e[0]),n.formErrors=!0):(n.hideError(e,"matches"),n.errors.matches=r.grep(n.errors.matches,function(r){return r!==e[0]}))},processErrors:function(){for(var e in n.errors)for(var a in n.errors[e]){var o,t=r(n.errors[e][a]),i=t.attr("id"),l=t.data("valideater-position");t.addClass("error error-"+e);var u=t.parent();if(u.hasClass("glow")&&u.addClass("error"),"false"!==t.attr("data-alert")&&(o="before"===l?t.prev().hasClass("alert-"+e):t.next().hasClass("alert-"+e),!o)){var d,h=t.attr("data-error-msg-"+e);d=h?h:s.errorMessages[e];var p='<span class="alert alert-'+e+" alert-"+i+'">'+d+"</span>";"before"===l?t.before(p):t.after(p)}}},hideError:function(r,e){var a=r.data("valideater-position");r.removeClass("error-"+e),r.removeClass("error");var o=r.parent();o.hasClass("glow")&&o.removeClass("error"),"before"===a?r.prev(".alert-"+e).remove():r.next(".alert-"+e).remove()}};return n[e]?n[e].apply(this):"object"!=typeof e&&e?void alert("Method "+e+" does not exist on jQuery.valideater"):n.init.apply(this)}}(window.jQuery||window.Zepto);