package service

import (
	"context"
	"time"

	"github.com/String-xyz/iframe-app/model"
)

type response struct {
	model.Response
	Data model.Quote `json:"data"`
}

type txResponse struct {
	model.Response
	Data struct {
		TxID string `json:"txID"`
	} `json:"data"`
}

type Service interface {
	Transact(body model.Transaction) (string, error)
	Quote(body model.Transaction) (model.Quote, error)
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
	resp, err := Post[txResponse](ctx, BASE_URL+"transact", body)
	if err != nil {
		return "", err
	}
	return resp.Data.TxID, nil
}

// Quote call internal apis to execute a Quote coming from the iframe
func (s service) Quote(body model.Transaction) (model.Quote, error) {
	ctx, cancel := contextWithTimeout(120)
	defer cancel()
	resp, err := Post[response](ctx, BASE_URL+"transact/quote", body)
	if err != nil {
		return model.Quote{}, err
	}
	return resp.Data, nil
}

func contextWithTimeout(duaration time.Duration) (context.Context, context.CancelFunc) {
	timeout := duaration * time.Second
	reqContext, cancel := context.WithTimeout(context.Background(), timeout)
	return reqContext, cancel
}
