export default function isMobile(){
    return !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;

}