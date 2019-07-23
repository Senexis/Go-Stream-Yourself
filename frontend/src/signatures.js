import crypto from "crypto" // Crypto library voor het signen

// eslint-disable-next-line
const certificate = "-----BEGIN CERTIFICATE-----\nMIIF3DCCA8SgAwIBAgIJAPwPbJQ\/Tv\/\/MA0GCSqGSIb3DQEBCwUAMIGCMQswCQYD\nVQQGEwJOTDEVMBMGA1UECAwMWnVpZC1Ib2xsYW5kMQ4wDAYDVQQHDAVCcmVkYTEP\nMA0GA1UECgwGQ2lyY2xlMQswCQYDVQQLDAJJVDEPMA0GA1UEAwwGQ2lyY2xlMR0w\nGwYJKoZIhvcNAQkBFg5pbmZvQGNpcmNsZS5ubDAeFw0xODA2MTkxMjA3NDlaFw0y\nMTA0MDgxMjA3NDlaMIGCMQswCQYDVQQGEwJOTDEVMBMGA1UECAwMWnVpZC1Ib2xs\nYW5kMQ4wDAYDVQQHDAVCcmVkYTEPMA0GA1UECgwGQ2lyY2xlMQswCQYDVQQLDAJJ\nVDEPMA0GA1UEAwwGQ2lyY2xlMR0wGwYJKoZIhvcNAQkBFg5pbmZvQGNpcmNsZS5u\nbDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAM6\/6sMBWy1akSJM5qbK\n3Jgwgc56YVKEdJKbwHgTFfJD1WfcxvXtws3iecM5RsTCW4yTEgKTkTpzyajCG\/UE\nZKPUWEalf4hNVceZH0\/HSmhubcgC4HjZy\/1Ixwu+Dn8g3Jjhk9puBpgqOIu+lIdR\n8sl8aF6ZB4pD6VpB1oxqpY\/gA81soJ1RKYbkdAu4fZs\/DkZjS28CrI0BHrVNtd3\/\nrH3r3mkEmQsW7rrXZROsWQiJNY+WOtivQxcXxZnwue7zsbCPProEz\/tCa+R5L6OP\nilAlvIkOuFC\/jSFot7ay8iPYzDcsy3Ol5Nr0yP2Q9gRqpRRIMohn71n5oHnI3kMT\nFcByJz+i2DBRbqo\/UNUvfoY1Ai3CvG4VXkIB823wPj960Ahi6rFpJE+KxBlUmE0f\ng+81pq3KQLZ8PEWLUeyV6lnpP8p+An2L+073s3rbSJut1zPK+2NLjnHYbIO\/30zi\nGPDsbNR76e82GiUHy1DtFDoZiuM+y+lK6ah2iSYQ0X4T8C3RnauFKLcNiTkuRkaL\nS23B42CLpWZDZ088DxHvTIgeKl+U1AiN\/uawuIPlz08nGLRScOVLYqYgnJ1Gguu6\nv7itj+etkJu0nLw8QQStR+crpMzuSOfDNaReUKOs55xJEqKJbw\/nSFnLVW4IdIB6\n\/w62NDf1T\/v\/ko6sNa8YUfGFAgMBAAGjUzBRMB0GA1UdDgQWBBRiQvGF6R2E1t7A\ntS3fP\/9dRkhj2TAfBgNVHSMEGDAWgBRiQvGF6R2E1t7AtS3fP\/9dRkhj2TAPBgNV\nHRMBAf8EBTADAQH\/MA0GCSqGSIb3DQEBCwUAA4ICAQC8NRr85BtlvC9UcKGNJ+kR\nVFtRXBlZMdYcdL+sIDJlpCZCwcP2Oua+eAmVyjSzTlu9lLgbFNx0UitG+4QPgEOR\nKLW5tjRn7yQhgA\/g0g1S2mRc4a2knPIaGIRJHtx8z7NxNL+nbPxpfII9H3YbIghP\nQan3LTnvPKM8+GbUgkxsEXe9vH\/DoFKHZJVdWi\/PtvQTrl2Gno0lSCJNuZgPSKnq\nVOcwWlL9yGbgbJ5P0+HVVIjO+8Xo5JnOSR2gWpVjEo9i1WCfb4dqrQAgePFehsGT\nISze0l5fOu84XkrNnnvmM4cYNmRTN9NEY\/idfnF9+TclmPEP+0hzaVmY83vgJx3P\n5UhKreOvpgD7USnumv0BEXxg\/XQCochrw0yU9Mip0D0SwcrBoagggpxr\/tys+F8\/\n6uC3t7EEpCs68FP0PvD+2QuVdRc8Obwil2MCZZCdREtcDqw\/M0Jqqx5GoJ+Eyfq7\n4INiI7mK\/+9yINztOwEDnZ7PB6kSQUDHNL23qABng85LoON+Rz1QAcIfbXdY1RZ0\nxvs1U6PrxL+t4odTtHzhzHSdRs6FCq9m6JZIAec910nFOFcZEuQrdNvj0QDh71Au\nT1iKtKjjrIWouhcJRt\/Ueky8brjzsWokbTtI7LxgkQ3Zum0VWcWlcrpX62gg\/etL\nmL4dwSBd+qMBTgoQU8MchA==\n-----END CERTIFICATE-----\n"
export function signToken(data, certificate) { // Functie om datas te signen
    if(!data) return false // Om te voorkomen dat alles vastloopt als de data leeg is
  
    let sign = crypto.createSign("RSA-SHA256") // De sign instantie
    sign.write(data) // Het token wordt gesigned 
    sign.end() 
    return sign.sign(certificate, "hex") // De signature wordt teruggestuurd
  }
  
export function verify(data, signature) {
    let verify = crypto.createVerify("RSA-SHA256")
    verify.update(data)
    return verify.verify(certificate, signature, "hex")
  }