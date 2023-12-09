import React, {useState} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  Progress,
  Chip,
  Input,
  Checkbox,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";

import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  ArrowUpLeftIcon,
  EllipsisVerticalIcon,
  ArrowUpOnSquareIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  QrCodeIcon,
} from "@heroicons/react/24/solid";
import { EnvelopeIcon, ShareIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { authorsTableData, projectsTableData } from "@/data";
export function PaymentLinks() {
  const [creating, setCreating] = useState(0);
  const [amount, setAmount] = useState(0.00);
  const [currency, setCurrency] = useState("MATIC");
  return (
    <>
      {creating == 0 && (
        <>
      <Card className="mx-3 mt-3 mb-6 lg:mx-4 bg-transparent">
        <CardBody className="p-4">
        <div className=" flex items-center justify-between flex-wrap gap-6">
          <div>
        <Typography variant="h3" color="blue-gray" className="mb-1">
                  Payment Links
                </Typography>
                <Typography variant="h7" className="max-w-sm  text-blue-gray-600 ">
                Create your payment link and Send money via
email, QR code or with your unique payment link
                </Typography>
                </div>
                <Button variant="outlined" size="lg" className="mr-10" onClick={()=> {setCreating(1)}}>
                <ArrowUpLeftIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" /> Create Payment Link
                        </Button>
                        </div>
                </CardBody>
                </Card>
        <Card>

        <CardBody className="overflow-x-scroll pt-0 pb-2">
        <Typography variant="h4" color="blue-gray" className="m-2 p-2">
                  Created Links
                </Typography>
          <table className="w-full min-w-[640px] table-auto">
            <tbody>
              {authorsTableData.map(
                ({ img, name, email, online, date }, key) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {/* <Avatar src={img} alt={name} size="sm" variant="rounded" />
                           */}
                           <LinkIcon className="mt-0.5 mr-2 inline-block h-8 w-8" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-lg   font-normal text-blue-gray-500">
                              {date}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-lg   font-semibold text-blue-gray-600">
                          $100
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={online ? "green" : "light-blue"}
                          value={online ? "Paid" : "Pending"}
                          className="py-0.5 px-2 text-md font-medium w-fit"
                        />
                      </td>

                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-lg   font-semibold text-blue-gray-600 border-gray-300 border-2 w-max px-3 py-1 rounded-lg hover:bg-gray-200"
                        >
                          View
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      </>
      ) }
      { creating == 1 && (
        <div  className="m-4 flex flex-wrap ">
      <div className="w-7/12  md:w-1/2 mt-15">
        <div className="text-left">
          <Typography variant="h4" className="font-bold">Send Money</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Create your payment link and Send money via email, QR code or with your unique
payment link</Typography>
        </div>
        <form className="mt-5 mb-2 mx-2 w-11/12 mr-3 max-w-screen">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Payment Title
            </Typography>
            <Input
              size="lg"
              placeholder="Eg. Mark's Salary"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required  
            />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Select Currency
            </Typography>
            <Select
        size="lg"
        label="Select "
        selected={(element) =>
          element &&
          React.cloneElement(element, {
            disabled: true,
            className:
              "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
          })
        }
        onChange={(element) => { setCurrency(element); console.log(element)}}
      >
              <Option className="flex items-center gap-2" value="MATIC" > <img src="/img/polygon-matic-logo.svg" height={20} width={20} alt="" /> MATIC - Polygon</Option>
              <Option className="flex items-center gap-2" value="ETH" > <img src="/img/ethereum-eth-logo.svg" height={20} width={20} alt="" /> ETH - Ethereum</Option>
              <Option className="flex items-center gap-2" value="SOL" > <img src="/img/solana-sol-logo.svg" height={20} width={24} alt="" /> SOL - Solana</Option>
            </Select>
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Amount
            </Typography>
            <Input
              type="number"
              size="lg"
              placeholder="$ 0.00"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={(e) => { if(e.target.value && e.target.value >= 0) setAmount(e.target.value); else setAmount(0.00)}}
            />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Payment Message
            </Typography>
            <Textarea
              type="text"
              size="lg"
              placeholder="Enter your message"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 "
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Switch 
      label={
        <div>
          <Typography color="blue-gray" variant="small" className="font-medium mt-4">
            Add Payment Due
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            The payment will be refunded to your wallet if the recipient does not withdraw within 24 hours.
          </Typography>
        </div>
      }
      containerProps={{
        className: "-mt-6 mr-2",
      }}
    />
          <Button className="mt-6" fullWidth onClick={()=>{setCreating(2)}}>
            Create Payment Link
          </Button>

        </form>

      </div>
            {/* <img
              src="/img/pattern.png"
              className="max-h-72 sm:w-1/2 lg:w-2/5 object-cover rounded-3xl  mx-0 sm:my-auto"
              style={{marginTop:"20vh"}}
            /> */}
            <Card color="black"  shadow={false} className="px-4 max-h-60 w-full" style={{marginTop:"20vh", marginLeft:"2.5%", maxWidth:"45%", background:"radial-gradient( circle 877px at 1% 82.3%, rgb(55, 60, 245) 2%, rgba(234,161,15,0.90) 101.2% )"}}>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-8"
      >

        <div className="flex w-full flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <Typography variant="h4" color="white" className="font-normal">
              Balance
            </Typography>
            <div className="5 flex items-center gap-2">
              {currency == "MATIC" &&
            <img src="/img/polygon-matic-logo.svg" height={32} width={32} alt="" />}
            {currency == "ETH" && <img src="/img/ethereum-eth-logo.svg" height={22} width={22} alt="" />}
            {currency == "SOL" && <img src="/img/solana-sol-logo.svg" height={32} width={32} alt="" />}
          <Typography color="white" variant="h5" className="font-sans font-normal">{currency}</Typography>

            </div>
          </div>
          <Typography color="white" variant="h1" className="font-sans">${amount?amount:0.00}</Typography>
        </div>
      </CardHeader>

      <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-left -ml-5"><Typography variant="h6" className="" color="white">From </Typography><div className="flex items-center gap-1"> <Typography  variant="h5" color="white">divyamagwl </Typography><ArrowUpRightIcon height={20} width={20} color="white"/> </div></div>
            <Typography variant="h6" className="-mb-10" color="white">NexGen</Typography>
            </div>

      </CardFooter>
    </Card>
          </div>
      )}

      {
        creating == 2 && (
          <>
          <div className="flex flex-col items-center justify-center">
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
            <Typography variant="h5" className="font-bold">Payment Link Created</Typography>
            <Typography variant="h6" className="font-normal w-1/2">Share your link to send money. You can share it via email, QR code or on other platforms with your link.</Typography>
            <Typography variant="h6" className="font-bold text-left">Payment Title</Typography>

            <Card color="black"  shadow={false} className="px-4 max-h-60 w-full mt-2" style={{ maxWidth:"50%", background:"radial-gradient( circle 877px at 1% 82.3%, rgb(55, 60, 245) 2%, rgba(234,161,15,0.90) 101.2% )"}}>
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 pt-0 pb-8"
      >

        <div className="flex w-full flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <Typography variant="h4" color="white" className="font-normal">
              Balance
            </Typography>
            <div className="5 flex items-center gap-2">
              {currency == "MATIC" &&
            <img src="/img/polygon-matic-logo.svg" height={32} width={32} alt="" />}
            {currency == "ETH" && <img src="/img/ethereum-eth-logo.svg" height={22} width={22} alt="" />}
            {currency == "SOL" && <img src="/img/solana-sol-logo.svg" height={32} width={32} alt="" />}
          <Typography color="white" variant="h5" className="font-sans font-normal">{currency}</Typography>

            </div>
          </div>
          <Typography color="white" variant="h1" className="font-sans">${amount?amount:0.00}</Typography>
        </div>
      </CardHeader>

      <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-left -ml-5"><Typography variant="h6" className="" color="white">From </Typography><div className="flex items-center gap-1"> <Typography  variant="h5" color="white">divyamagwl </Typography><ArrowUpRightIcon height={20} width={20} color="white"/> </div></div>
            <Typography variant="h6" className="-mb-10" color="white">NexGen</Typography>
            </div>

      </CardFooter>
    </Card>
    <Typography variant="h6" className="font-normal mt-3 font-sans">Send your link via</Typography>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outlined" className="flex items-center gap-2"><QrCodeIcon height={20} width={20} />QR Code</Button>  
            <Button variant="outlined" className="flex items-center gap-2"><EnvelopeIcon  height={20} width={20} c/> Email</Button>
            <Button variant="outlined" className="flex items-center gap-2"><LinkIcon  height={20} width={20} c/> Link</Button>
            <Button variant="outlined" className="flex items-center gap-2"><ShareIcon  height={20} width={20} c/> Share</Button>
          </div>
          <Progress value={100} variant="filled" size="sm" className="w-1/3 mt-3"/>
          <Typography variant="h5" className="font-bold mt-3">Deposit Transaction</Typography>
          <Button variant="outlined" className="flex items-center gap-2" disabled><LinkIcon height={20} width={20} />0x33cb4243047978....</Button>  
          </div>
</>
        )
      }
    </>
);}

export default PaymentLinks;
