package service

import (
	"context"
	"time"

	"github.com/String-xyz/iframe-app/model"
)

type response struct {
	model.Response
	Data model.Qoute `json:"data"`
}

type trxResponse struct {
	model.Response
	Data struct {
		TxID string `json:"txID"`
	} `json:"data"`
}

type Service interface {
	Transact(body model.Transaction) (string, error)
	Qoute(body model.Transaction) (model.Qoute, error)
}

type service struct {
}

func New() Service {
	return &service{}
}

// Transact call internal apis to execute a transaction coming from the iframe
func (s service) Transact(body model.Transaction) (string, error) {
	ctx, cancel := contextWithTimeout(120)
	defer cancel()
	resp, err := Post[trxResponse](ctx, BASE_URL+"transact", body)
	if err != nil {
		return "", err
	}
	return resp.Data.TxID, nil
}

// Qoute call internal apis to execute a Qoute coming from the iframe
func (s service) Qoute(body model.Transaction) (model.Qoute, error) {
	ctx, cancel := contextWithTimeout(120)
	defer cancel()
	resp, err := Post[response](ctx, BASE_URL+"transact/qoute", body)
	if err != nil {
		return model.Qoute{}, err
	}
	return resp.Data, nil
}

func contextWithTimeout(duaration time.Duration) (context.Context, context.CancelFunc) {
	timeout := duaration * time.Second
	reqContext, cancel := context.WithTimeout(context.Background(), timeout)
	return reqContext, cancel
}
