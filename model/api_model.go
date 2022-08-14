package model

import "time"

type Response struct {
	Sucess bool `json:"success"`
}

type Estimate struct {
	Timestamp  time.Time `json:"timestamp"`
	BaseUSD    float64   `json:"baseUSD"`
	GasUSD     float64   `json:"gasUSD"`
	TokenUSD   float64   `json:"tokenUSD"`
	ServiceUSD float64   `json:"serviceUSD"`
	TotalUSD   float64   `json:"totalUSD"`
}

type Qoute struct {
	Estimate  Estimate `json:"estimate"`
	Signature string   `json:"signature"`
}

type Transaction struct {
	ChainID          int      `json:"chainID"`
	UserAddress      string   `json:"userAddress"`
	ContractABI      []string `json:"contractABI"`
	ContractFunction string   `json:"contractFuction"`
	ContractParams   []string `json:"contractParams"`
	TxValue          string   `json:"txValue"`
	GasLimit         float64  `json:"gasLimit"`
	Qoute            Qoute    `json:"qoute,omitempty"`
	CardToken        string   `json:"cardToken,omitempty"`
}
