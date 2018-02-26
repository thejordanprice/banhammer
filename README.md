![Logoish](https://i.imgur.com/xRC51X0.png)

[![GitHub issues](https://img.shields.io/github/issues/thejordanprice/banhammer.svg)](https://github.com/thejordanprice/banhammer/issues)
[![GitHub stars](https://img.shields.io/github/stars/thejordanprice/banhammer.svg)](https://github.com/thejordanprice/banhammer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/thejordanprice/banhammer.svg)](https://github.com/thejordanprice/banhammer/network)
[![GitHub license](https://img.shields.io/github/license/thejordanprice/banhammer.svg)](https://github.com/thejordanprice/banhammer/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/thejordanprice/banhammer.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fthejordanprice%2Fbanhammer)

A small webapp to parse log files (such as auth.log); then return copy/paste firewall rules to ban incoming traffic from said addresses on multiple routing/firewall platforms. So far it can output, Cisco iOS, iptables, Mikrotik RouterBoard, and ufw rules.

### Intro

Over the last year or so I've noticed an increase of IoT botnets floating around. After monitoring my incoming traffic over a lengthy period of time. I have realized that 90% of all the incoming attacks are SSH login attempts. The sad part is they keep coming even if you don't have any SSH servers listening. *Do you have a data cap?* :worried:

Considering every bit is counted that goes through the modem; these attacks have caused my network to use **4.2GB** of data in **dropped** packets over the course of 10 days. After a while, this could be come a big problem.

##### Screenshot

![mobile](https://i.imgur.com/iiT2lq1.png)

### Getting Started

Head to the [stable](https://thejordanprice.github.io/banhammer) running demo; or host your own.
Bring your own log files and throw them into the mix. It should output something like this, depending on what you have picked.

    ip access-list extended BLOCK
    permit icmp any any echo-reply
    permit icmp any any unreachable
    deny icmp any any log
    deny ip host 20.0.0.0 any log
    permit ip any any

Then copy that into whatever terminal is required for that particular model you have chosen.

### License

MIT
